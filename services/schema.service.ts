export const SchemaService = {
  config: (name: string) => {
    return `/schema/config/${name}`
  },
  list: (name: string) => {
    return `/schema/list/${name}`
  },
  post: (name: string) => {
    return `/schema/post/${name}`
  }
}