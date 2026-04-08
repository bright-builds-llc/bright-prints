import JSZip from "jszip";

export type ThreeMfMetadata = Record<string, string>;

export type ThreeMfMesh = {
  triangles: Array<[number, number, number]>;
  vertices: Array<{
    x: number;
    y: number;
    z: number;
  }>;
};

function buildModelXml(mesh: ThreeMfMesh, metadata: ThreeMfMetadata) {
  const metadataXml = Object.entries(metadata)
    .map(
      ([name, value]) =>
        `<metadata name="${name}">${value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</metadata>`
    )
    .join("");

  const verticesXml = mesh.vertices
    .map(
      (vertex) =>
        `<vertex x="${vertex.x.toFixed(4)}" y="${vertex.y.toFixed(4)}" z="${vertex.z.toFixed(4)}" />`
    )
    .join("");

  const trianglesXml = mesh.triangles
    .map(
      ([v1, v2, v3]) =>
        `<triangle v1="${v1}" v2="${v2}" v3="${v3}" />`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  ${metadataXml}
  <resources>
    <object id="1" type="model">
      <mesh>
        <vertices>${verticesXml}</vertices>
        <triangles>${trianglesXml}</triangles>
      </mesh>
    </object>
  </resources>
  <build>
    <item objectid="1" />
  </build>
</model>`;
}

export async function buildThreeMfArchive(options: {
  mesh: ThreeMfMesh;
  metadata: ThreeMfMetadata;
}) {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml" />
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />
</Types>`
  );
  zip.folder("_rels")?.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel" Target="/3D/3dmodel.model" />
</Relationships>`
  );
  zip.folder("3D")?.file(
    "3dmodel.model",
    buildModelXml(options.mesh, options.metadata)
  );

  return zip.generateAsync({ type: "blob" });
}
