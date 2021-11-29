const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

let userInfo;

if (getCookieValue('userInfo') != undefined || getCookieValue('userInfo') != null) {
    userInfo = JSON.parse(getCookieValue('userInfo'));
}

console.log(userInfo);