import { firebase } from "@/integrations/firebase/client";

export async function seedDeployments(onLog?: (msg: string) => void) {
  const log = (msg: string) => {
    console.log(`[GitHub Seeder] ${msg}`);
    if (onLog) onLog(msg);
  };

  const token = import.meta.env.VITE_GITHUB_TOKEN || "";
  const repo = import.meta.env.VITE_GITHUB_REPO || "";

  if (!token) {
    throw new Error("GitHub token is not configured.");
  }
  if (!repo) {
    throw new Error("GitHub repository is not configured.");
  }

  log(`Fetching deployments for repository "${repo}"...`);

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${token}`,
  };

  const deploymentsUrl = `https://api.github.com/repos/${repo}/deployments`;
  
  try {
    const response = await fetch(deploymentsUrl, { headers });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`GitHub API returned error ${response.status}: ${errorBody}`);
    }

    const deployments = await response.json();
    if (!Array.isArray(deployments)) {
      throw new Error("Invalid response format from GitHub API: expected an array.");
    }

    log(`Found ${deployments.length} deployments. Fetching statuses and seeding...`);

    let successCount = 0;
    for (const dep of deployments) {
      try {
        const statusesUrl = dep.statuses_url;
        const statusRes = await fetch(statusesUrl, { headers });
        let status = "unknown";
        let targetUrl = "";

        if (statusRes.ok) {
          const statuses = await statusRes.json();
          if (Array.isArray(statuses) && statuses.length > 0) {
            // The first status is the latest one
            const latestStatus = statuses[0];
            status = latestStatus.state || "unknown";
            targetUrl = latestStatus.environment_url || latestStatus.target_url || "";
          }
        }

        const deploymentData = {
          id: String(dep.id),
          environment: dep.environment || "Production",
          sha: dep.sha || "",
          ref: dep.ref || "",
          creator_login: dep.creator?.login || "",
          creator_avatar: dep.creator?.avatar_url || "",
          status: status,
          target_url: targetUrl,
          created_at: dep.created_at || new Date().toISOString(),
          updated_at: dep.updated_at || new Date().toISOString(),
          synced_at: new Date().toISOString(),
        };

        const result = await firebase.from("deployments").upsert(deploymentData, { onConflict: "id" });
        if (result.error) {
          throw new Error(result.error.message);
        }
        successCount++;
      } catch (err) {
        log(`Failed to sync deployment ${dep.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    log(`Seeding complete. Successfully upserted ${successCount} deployments!`);
    return successCount;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`Seeding failed: ${msg}`);
    throw err;
  }
}
