	const axios=require("axios") 
	
	//axios.defaults.timeout = 5000

	module.exports= {
	    //获取
		setAxiosGetPromise: (url, params = {}) => {
	        return axios.get(url, { params: params }).then(response => {
	            return response.data
	        }).catch(err => {
	            throw err
	        })
	    },
	    //新增
	    setAxiosPostPromise: (url, data) => {
	        return axios.post(url, data).then(response => {
	            return response.data
	        }).catch(err => {
	            throw err
	        })
	    },
	    //更新全部
	    setAxiosPutPromise: (url, data) => {
	        return axios.put(url, data).then(response => {
	            return response.data
	        }).catch(err => {
	            throw err
	        })
	    },
	    //删除
	    setAxiosDeletePromise: (url, params = {}) => {
	        return axios.delete(url, { params: params }).then(response => {
	            return response.data
	        }).catch(err => {
	            throw err
	        })
	    }
	}