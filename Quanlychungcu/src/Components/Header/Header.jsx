function Header() {
  return (
    <>
      <div id="header">
        <span className="item">
          <div id="logo-part">
            <img
              src="/src/assets/images/favicon/android-chrome-512x512.png"
              alt="dmm"
            />
            <div id="logo-text">
              <div className="green-light-container">
                {" "}
                {/* Container mới cho GREEN LIGHT và hr */}
                <div className="green-light-text">GREEN LIGHT</div>
                <hr />
              </div>
              <span>Phần mềm quản lý chung cư Green Sun</span>
            </div>
          </div>
        </span>
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
          className="item"
        >
          <div
            style={{
              fontSize: "2rem",
              color: "green",
              textAlign: "right",
              marginRight: "1rem",
            }}
          >
            Xin chào!
          </div>
          <div
            style={{
              fontSize: "1.2rem",
              color: "grey",
              textAlign: "right",
              marginRight: "1rem",
            }}
          >
            {localStorage.getItem("email")}
          </div>
          <button
            style={{
              marginTop: "2rem",
              marginRight: "1rem",
              background: "red",
              color: "white",
              borderRadius: "15px",
              width: "8rem",
            }}
            onClick={() => (window.location.href = "/index1.html")}
          >
            Đăng xuất
          </button>
        </span>
      </div>
    </>
  );
}
export default Header;
