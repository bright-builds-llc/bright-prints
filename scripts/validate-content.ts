import { loadPublicContent } from "../app/lib/content/load.server";

async function main() {
  const content = await loadPublicContent();

  console.log(
    `Validated ${content.creators.length} creators, ${content.prints.length} prints, and ${content.generators.length} generators`
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown content validation failure";
  console.error(message);
  process.exit(1);
});
