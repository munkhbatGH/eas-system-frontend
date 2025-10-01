export const SchemaService = {
  config: (name: string) => {
    return `/schema/config/${name}`
  },
  list: (name: string) => {
    return `/schema/list/${name}`
  },
  post: (name: string) => {
    return `/schema/post/${name}`
  },
  put: (name: string) => {
    return `/schema/put/${name}`
  },
  delete: (name: string) => {
    return `/schema/delete/${name}`
  }
}