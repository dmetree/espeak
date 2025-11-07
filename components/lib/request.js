import axios from "./axios";


export async function request({ path, args, body }) {
    if (args) {
        let first = true
        for (var i = 0; i < Object.keys(args).length; i++) {
            let arg = Object.keys(args)[i]
            let value = args[arg]
            if (value == undefined) continue

            if (first) path += "?"
            else path += "&"

            first = false

            path += `${arg}=${value}`
        }
    }

    let response = (body ? await axios.post(path, body) : await axios.get(path))
    if (response.status != 200) throw new Error(JSON.stringify(response.data))

    return response.data.data ?? response.data
}
