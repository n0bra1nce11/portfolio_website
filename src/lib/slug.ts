// Legacy `type: 'content'` collections keep the file extension in `entry.id`
// (e.g. "hospital-vapt.mdx"). Strip it for clean URLs.
export function slugify(id: string): string {
  return id.replace(/\.(mdx?|markdown)$/i, '');
}
