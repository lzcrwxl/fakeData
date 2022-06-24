/**
 * 格式化的响应类型
 */
export default class Response {

    static format(response) {
        if (response === undefined || response === null) {
            return new Response().failure('Reponse.format 接受了一个空对象');
        }
        if(response instanceof Error){
            return new Response().failure(response.stack);
        } else if (response.code !== undefined) {
            return new Response(response.result, response.code, response.message, response.source);
        } else {
            return new Response(response);
        }
    }

    static async fromPromise(promise) {
        if (!promise || !promise instanceof Promise) {
            throw '传入参数不是一个Promise'
        }
        return await promise
            .then(res => {
                if(res===null){
                    return Response.format(res);
                }
                return Response.format(res).success();
            })
            .catch(err => {
                return Response.format(err);
            })
    }

    static isSuccess(response) {
        return response && response instanceof Response && response.code === 0
            // if (response && response instanceof Response && response.code === 0) {
            //     return true;
            // } else {
            //     return false;
            // }
    }

    constructor(result = '', code = null, message = null, source = null) {
        this.success(result);
        if (code) this.code = code;
        if (message) this.message = message;
        if (source) this.source = source;
    }

    success(result) {
        this.code = 0;
        if (result !== undefined) {
            this.result = result;
        }
        return this;
    }

    failure(message = '', code = 1) {
        this.message = message;
        this.code = code;
        this.source = 'service';
        return this;
    }

    get() {
        return {
            code: this.code,
            message: this.message,
            result: this.result,
            source: this.source,
        }
    }

    toString() {
        return JSON.stringify(this.get())
    }
}
