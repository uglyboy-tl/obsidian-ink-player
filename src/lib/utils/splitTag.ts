export function splitTag(
  tag: string
): { property: string; val: string } | null {
  // 输入验证
  if (typeof tag !== "string" || tag.trim() === "") {
    return null;
  }

  const propertySplitIdx = tag.indexOf(":");

  // 检查是否找到分隔符
  if (propertySplitIdx >= 0) {
    const property = tag.slice(0, propertySplitIdx).trim();
    const val = tag.slice(propertySplitIdx + 1).trim();

    // 确保属性和值都非空
    if (property && val) {
      return {
        property: property.toUpperCase(),
        val,
      };
    }
  }

  return null;
}
