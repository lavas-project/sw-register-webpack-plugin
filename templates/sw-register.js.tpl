if ('serviceWorker' in navigator) {

    /**
     * 处理 service worker 更新
     *
     * @param  {Object} e event source
     */
    var handlerUpdateMessage = e => {

        // 在这里可以检测到 service worker 文件的更新，通常我们建议做页面的 reload

        var metas = document.getElementsByTagName('meta');

        for (let i = 0, len = metas.length; i < len; i++) {
            let meta = metas[i];
            if (meta.name === 'theme-color') {
                meta.content = '#000';
            }
        }

        var dom = document.createElement('div');
        dom.innerHTML = '${refreshTipsHtml | raw}';
        document.body.appendChild(dom);
        setTimeout(() => {
            var refreshDom = document.getElementById('app-refresh');
            refreshDom.style.height = 52 + 'px';
            refreshDom.style.lineHeigit = 52 + 'px';
            refreshDom.style.opacity = 1;
        }, 16);
    };


    navigator.serviceWorker.register('/${swFileName}?v=${version}');

    navigator.serviceWorker.addEventListener('message', e => {
        // received the update message from sw
        if (e.data === 'updateMessage') {
            handlerUpdateMessage(e);
        }
    });

    // handlerUpdateMessage();

}

