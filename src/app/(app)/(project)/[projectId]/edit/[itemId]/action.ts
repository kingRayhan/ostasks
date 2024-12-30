import { bootstrapItem } from "@/app/actions/items.action";
import { redirect } from "next/navigation";

export const bootstrapFormItem = async (state: any, formData: FormData) => {
  const result = await bootstrapItem(state.projectId as string);
  return redirect(`/${state.projectId}/edit/${result?.itemId}`);
};
