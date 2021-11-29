const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

let userInfo;

if (getCookieValue('cookie1') != undefined || getCookieValue('cookie1') != null) {
    userInfo = JSON.parse(getCookieValue('cookie1'));
}

console.log(userInfo);