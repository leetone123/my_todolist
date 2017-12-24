//全局配置axios
import Qs from 'qs'
export default{
	  url: '/task',
		baseURL:'',
	  method:'POST',
	  transformRequest: [function (data) {
	    //为了避免qs格式化时对内层对象的格式化先把内层的对象转为
	    data.CustData = JSON.stringify(data.CustData);
	    //由于使用的form-data传数据所以要格式化
	    data = Qs.stringify(data);
	    return data;
	  }],
	  transformResponse: [function (data) {
	    return data;
	  }],
	  headers: {'Content-Type':'application/x-www-form-urlencoded'},
	  paramsSerializer: function(params) {
	    return Qs.stringify(params)
	  },
	timeout: 1000,
	withCredentials: false, // default
	responseType: 'json', // default
	onUploadProgress: function (progressEvent) {
	    // Do whatever you want with the native progress event
	},
	onDownloadProgress: function (progressEvent) {
	    // Do whatever you want with the native progress event
	},
	maxContentLength: 2000,
	validateStatus: function (status) {
	    return status >= 200 && status < 300; // default
	},
	maxRedirects: 5, // default
}
//本地测试时置为空，生成环境打包时设为本地url
// export const baseurl ="http://localhost:9999"; //本地SpringBoot启动时路径
export const baseurl =""; //本地Vue启动时的路径
// export const baseurl = "http://101.132.160.79:9999"; //正式发布的路径配置