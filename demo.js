$(document).ready(function() {
    let ivrList = []
    // const server = 'http://192.168.0.187:8084/'
    const server =  'https://cc.v-call.cn/'
    function onLogin() {
        const url = server + 'obc/api/login'
        const params = {
            username: 'ceshi',
            password: 'd2VpaHVjZXNoaQ==' //'MTIzNDU2'
        }
        $.post(url, params, res => {
            console.log(res)
            const data = res.data
            localStorage.flowToken = data.auth
            localStorage.companyId = data.companyId
            localStorage.userInfo = JSON.stringify(data.userInfo)
            getData()
        })
    }

    function getData() {
        const url = server + 'obc/api/ivr/page'
        const params = {
            token: localStorage.flowToken,
            pageNo: 1,
            pageSize: 9
        }
        $.get(url, params, res => {
            ivrList = res.data.records
            setCard()
            clickEvent()
        })
    }

    function setCard() {
        const html = `${
            ivrList.map(item => `
                <div class="cardItem">
                    <div class="voiceCard autoH">
                        <div class="cardHead">
                            <div class="cardTop">
                                <div class="card-title">
                                    ${ item.name }
                                </div>
                            </div>
                            <p>模 版 SN: ${ item.id }</p>
                            <p>创建时间: ${ item.ctime ? item.ctime : '' }</p>
                            <p>更新时间: ${ item.utime ? item.utime : '' }</p>
                        </div>
                        <div class="cardFooter">
                            <div class="toolBox">
                                <span class="btn edit" ivr-id=${item.id}>编辑模版</span>
                                <span class="btn detail" ivr-id=${item.id}>查看模版</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')
        }`
        $('.cardBox').html(html)
    }

    function createTem(id, state) {
        $('#sdkBox').show()
        flowSdk.init({
            el: 'flowsdk',
            baseUrl: 'https://cc.v-call.cn',
            authType: 'default',
            id: id,
            state: state,
            onClose() {
                $('#sdkBox').hide()
            },
            onSave(id) {
                $('#sdkBox').hide()
                console.log(id)
            }
        })
    }

    function clickEvent() {
        $('.add').click(function(){
            createTem('', '')
        })
        $('.edit').click(function(){
            const id = $(this).attr('ivr-id')
            createTem(id, 'edit')
        })
        $('.detail').click(function(){
            const id = $(this).attr('ivr-id')
            createTem(id, 'detail')
        })
    }

    function initPage() {
        $('#sdkBox').hide()
        onLogin()
    }

    initPage()
})