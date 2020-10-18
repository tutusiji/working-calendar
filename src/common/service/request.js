import axios from 'axios'
import Vue from 'vue'
import { Message } from 'element-ui'

Vue.prototype.$Message = Message


const axiosInstance = axios.create({
	// baseURL: getApiBaseUrl(),
	timeout: 15000
})


async function request(method = 'get', path = '', params = null) {
	// const token = await getToken() || ''
	const requestConfig = {
		method,
		url: path,
		withCredentials: true
	}
	if (params) {
		if (method === 'get') {
			requestConfig.url = `${path}?${JSON.stringify(params)}`
		} else {
			requestConfig.data = params
		}
	}

	requestConfig.headers = {
		// ...commonHeaders(token)
	}
	return axiosInstance(requestConfig)
		.then((response) => {
            console.log(response)
			// const body = response.data
			// if (Number(body.code) === Number(STATUS_CODE.SUCCESS)) {
			// 	return { response: body }
			// }
			// // token 无效
			// if (
			// 	body.code === STATUS_CODE.INVALID_TOKEN
			// 	|| body.code === STATUS_CODE.TOKEN_ERROR
			// 	|| body.code === STATUS_CODE.TOKEN_NOT_MATCH
			// 	|| body.code === STATUS_CODE.TOKEN_IS_EMPTY
			// 	|| body.code === STATUS_CODE.EXPIRED_TOKEN
			// ) {
			// 	Toast(`INVALID_TOKEN<br>code: ${body.code}<br>msg: ${body.msg}`)
			// }
            // Toast(`${body.msg}`)
            // this.$notify({
            //     title: '成功',
            //     // message: '这是一条成功的提示消息',
            //     dangerouslyUseHTMLString: true,
            //     message: '<strong>这是 <i id="show">HTML</i> 片段</strong>'
            //     // type: 'success'
            //   });
            //   Vue.prototype.$Message('发出');
			return false
		})
		.catch(() => {
			// if (error instanceof Error) {
			// 	Toast('您的网络好像有些问题哦，<br>请稍后再试～')
			// } else {
			// 	Toast('无法发起数据请求，<br>请检查你的网络是否可用')
			// }
			// if (loading) {
			// 	loading.close()
			// }
			return false
		})
}

export default request
