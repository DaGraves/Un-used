import { API_BASEPATH } from 'react-native-dotenv'

const urls = {
  index: "",
  user: {
    user: "users",
  },
}

/**
 *
 * `routeName` - comes as a string and the function resolves which url is to be used,
 * in the case of custom urls with parameters the url will have {FooBar} in it
 * and when calling this route it's required on the params object to pass in the
 * values with the key specified in the url
 */

module.exports = (routeName, params) => {

  params = params || {}
  try {
    const splitted = routeName.split(".")
    let value = urls

    for (const k in splitted) {
      const key = splitted[k]
      value = value[key]
      if (!value)
        break
    }
    if (typeof value !== "string") {
      return null
    }
    let out = API_BASEPATH + value

    for (const k in params) {
      out = out.replace("{" + k + "}", params[k])
    }

    return out
  } catch (errorApiRoutes) {
    console.log(errorApiRoutes)
    return
  }
}
