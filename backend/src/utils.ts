import { NodeModel } from "./models/node";

export function random(len: number) {
  let options = "qwertyuioasdfghjklzxcvbnm12345678";
  let length = options.length;

  let ans = "";

  for (let i = 0; i < len; i++) {
    ans += options[Math.floor(Math.random() * length)]; // 0 => 20
  }

  return ans;
}

export const recursiveDelete = async (nodeId: string) => {
  const children = await NodeModel.find({ parentId: nodeId });

  for (const child of children) {
    if (child?._id) {
      await recursiveDelete(child?._id?.toString());
    }
  }

  await NodeModel.findByIdAndDelete(nodeId);
};
