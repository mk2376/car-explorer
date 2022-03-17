import { Metadata } from 'src/BabylonGame/interfaces';

const regexpObjectType = new RegExp(/(?<=objectType:).*?(?=s|,|$)/g);
const regexpMass = new RegExp(/(?<=mass:).*?(?=s|,|$)/g);

export function parseMetadata(input: string) {
  // console.log(mesh.name, mesh.name.match(regexpMass));

  const metadata: Metadata = {
    objectType: input.match(regexpObjectType)![0],
    mass: Number(input.match(regexpMass)![0]),
  };

  return metadata;
}
