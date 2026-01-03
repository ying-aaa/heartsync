/**
 * 调用该脚本，通过获取登录页样式配置，动态修改keyClock登录页的样式。
 */
(function () {
  setTimeout(() => {
    document.body.style.display = "unset";
  }, 1000);
  // fetch(
  //   `${
  //     window.location.origin
  //   }/gapi/ucx/noauth/login-page-style/enabled?tenantCode=${
  //     localStorage.getItem("tenant_code") || "default"
  //   }`
  // )
  //   .then((response) => response.json())
  //   .then((res) => {
  const res = {
    "id": "f5b40960-46f6-11ee-a1a7-6b348a8693ca",
    "styleName": "HeartSync",
    "enabled": true,
    "additionalInfo": {
      "themeName": "HeartSync",
      "systemName": "HeartSync",
      "systemNameColor": "#000000",
      "tabLogo": "/assets/workbench/heartsync.png",
      "tabName": "HeartSync",
      "systemLogo": "/assets/workbench/heartsync.png",
      // "accountWindowBackground": "https://img.freepik.com/free-photo/scene-sunbeams-forest-plant-sunlight_1232-3986.jpg?semt=ais_incoming&w=740&q=80",
      // "loginPageBackground": "https://img.freepik.com/free-photo/scene-sunbeams-forest-plant-sunlight_1232-3986.jpg?semt=ais_incoming&w=740&q=80",
      "btnBg": "#3875c6",
      "btnTextColor": "#ffffff"
    },
    "tenantCode": "heartsync",
    "createdTime": 1693373699644,
    "updatedTime": 1748422993270
  }
  function isMobile() {
    let mobile = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return mobile !== null;
  }
  // console.log('res.additionalInfo >>:', res.additionalInfo);
  const {
    accountWindowBackground,
    btnBg,
    btnTextColor,
    systemNameColor,
    systemLogo,
    systemName,
    tabLogo,
    tabName,
    themeName,
  } = res.additionalInfo;

  document.getElementById("username").value = "admin";
  document.getElementById("password").value = "admin123";

  document.getElementsByClassName("login-pf-header")[0].style.marginBottom =
    "0px";
  document.getElementsByClassName("login-pf-header")[0].style.color =
    systemNameColor;
  // 修改卡片的border-top(将蓝色的顶部边框进行隐藏)
  let cardPf = document.getElementsByClassName("card-pf")[0];
  if (cardPf) {
    cardPf.style.border = "unset";
    cardPf.style.padding = "unset";
    cardPf.style.width = "550px";
    cardPf.style.maxWidth = "550px";
  }

  // 修改背景图及样式
  let loginPfPage = document.getElementsByClassName("login-pf-page")[0];
  if (loginPfPage) {
    loginPfPage.style.height = "100%";
    loginPfPage.style.width = "100%";
    loginPfPage.style.display = "flex";
    loginPfPage.style.alignItems = "center";
  }

  document.body.style.background = `url(${accountWindowBackground}) no-repeat center center`;
  document.body.style.backgroundSize = "cover";

  // 应用名称显示（显示卡片内标题，将卡片外的标题进行隐藏）
  document.getElementById("kc-header").style.display = "none";
  let kcPageTitle = document.getElementById("kc-page-title");
  if (kcPageTitle) {
    kcPageTitle.style.display = "unset";
    kcPageTitle.style.fontWeight = "bold";
    kcPageTitle.style.textAlign = "left";
    kcPageTitle.style.borderBottom = "1px solid #f4efef";
    kcPageTitle.style.padding = "10px 0 20px 20px";
    kcPageTitle.innerText = systemName;
  }

  // 修改登录页页签icon
  document.querySelector("link[rel='icon']").href = tabLogo;
  document.title = tabName;

  document.getElementById("kc-content-wrapper").style.flex = "1";
  document.getElementById("kc-content-wrapper").style.marginTop = "10px";

  // 修改验证码区域样式
  let captchaCode = document.getElementById("captchaCode");
  if (captchaCode) {
    captchaCode.parentElement.style.display = "flex";
    captchaCode.parentElement.style.alignItems = "center";
  }

  // 修改中英文转化
  // document.getElementById('username') && (document.getElementById('username')?.previousSibling?.previousSibling.innerText = '账号：');
  // document.getElementById('password') && (document.getElementById('password')?.previousSibling?.previousSibling.innerText = '密码：');

  // 修改登录按钮样式
  let kcLogin = document.getElementById("kc-login");
  if (kcLogin) {
    kcLogin.value = "登录";
    kcLogin.style.background = btnBg;
    kcLogin.style.color = btnTextColor;
  }

  // 退出
  const instruction = document
    .getElementById("kc-logout-confirm")
    ?.getElementsByClassName("instruction");
  if (instruction?.length) {
    instruction[0].innerText = "是否退出登录?";
  }
  const instruction2 = document
    .getElementById("kc-info-message")
    ?.getElementsByClassName("instruction");
  if (instruction2?.length) {
    instruction2[0].innerText = "您已退出登录！";
  }
  const pfCButton = document.getElementById("kc-logout");
  if (pfCButton) {
    pfCButton.value = "退出";
  }

  // 处理左侧logo图片的显示
  let kcContent = document.getElementById("kc-content");
  if (kcContent) {
    let imgStyle = "margin-right:20px;height:150px;width:150px;";
    if (isMobile()) {
      kcContent.style.padding = "0 20px 30px 20px";
      imgStyle = "margin-right:20px;height:150px;width:150px;margin:auto;";
    } else {
      kcContent.style.display = "flex";
      kcContent.style.alignItems = "center";
      kcContent.style.padding = "0 20px 30px 20px";
    }

    let logoElement = `
          <div style=${imgStyle}>
            <img src="${systemLogo}" alt="" style="height:100%;width:100%;object-fit:contain;">
          </div>
        `;
    if (isMobile()) {
      let titleText = document.getElementById("kc-page-title").innerText;
      logoElement += `
            <div style="text-align:center;font-size:18px;font-weight:bold;">${titleText}</div>
          `;
      document.getElementsByClassName("login-pf-header")[0].style.display =
        "none";
      document.getElementsByClassName("pf-c-button")[0].style.height =
        "40px";
      document.getElementsByClassName("pf-c-button")[0].style.borderRadius =
        "20px";
    }
    document.getElementById("kc-content").style.flex = "1";
    kcContent.insertAdjacentHTML("afterbegin", logoElement);
    document.body.style.display = "unset";
  }

  /*************************以下是对修改密码界面的样式调整****************************/
  let kcFeedbackText = document.getElementsByClassName("kc-feedback-text");
  if (kcFeedbackText.length) {
    let alertText = kcFeedbackText[0].innerText;
    if (alertText === "Please re-authenticate to continue") {
      kcFeedbackText[0].innerText = "请输入当前密码进行验证";
    }
  }

  let kcFormOptions = document
    .getElementById("kc-form-options")
    ?.getElementsByTagName("label");
  if (kcFormOptions?.length) {
    if (kcFormOptions[0].outerText === "Sign out from other devices") {
      kcFormOptions[0].innerHTML =
        '<input type="checkbox" id="logout-sessions" name="…alue="on" checked=""> 从其他设备注销';
    }
  }

  let kcInfo = document.getElementById("kc-info");
  if (kcInfo) {
    kcInfo.style.margin = "20px 0px -20px 0px";
    document.getElementById("kc-info-wrapper").style.fontSize = "12px";
  }
  // });
})();
