import { isUndefined } from "./common"

export function toast(params, complete) {
    let config = {}
    if (typeof params === 'string') {
        config = {
            title: params,
            icon: 'none',
            duration: 3500,
            complete: complete || function () { }
        }
    }
    else {
        if (!params.duration) {
            params.duration = 3500
        }
        config = params
    }


    uni.showToast(config)
}

/**
 * 错误toast
 * @param {Object} content
 */
export function toastError(content) {
    const params = {
        title: content,
        icon: 'error',
    }
    toast(params)
    console.log(params)
}


// modal
export function Modal(options) {
    const config = {}

    // 参数合并兼容
    config.title = options.title || ''
    config.content = options.content || '弹框信息'
    config.showCancel = isUndefined(options.showCancel) ? true : options.showCancel
    config.cancelText = options.cancelText || '取消'
    config.cancelColor = options.cancelColor || '#000000'
    config.confirmText = options.confirmText || '确定'
    config.confirmColor = options.confirmColor || '#576B95'
    config.confirm = options.onConfirm || function () { }
    config.cancel = options.onCancel || function () { }
    config.complete = options.onComplete || function () { }

    // 二次封装回调
    let confirm = config.confirm,
        cancel = config.cancel;

    config.success = function (result) {
        if (result.cancel) {
            cancel && cancel();
            return;
        }

        confirm && confirm();
    }

    config.fail = function (err) {
        cancel && cancel(err);
    }

    uni.showModal(config)
}

// alert
export function Alert(content, callback, confirmText = '确定') {
    if (typeof callback === 'string') {
        confirmText = callback;
        callback = function () { };
    }

    Modal({
        content,
        showCancel: false,
        confirmText,
        complete: callback
    })
}

// confirm
export function Confirm(options) {
    Modal({
        content: options.content,
        onConfirm: options.onConfirm,
        onCancel: options.onCancel,
        onComplete: options.onComplete,
        cancelText: options.cancelText,
        confirmText: options.confirmText
    })
}
