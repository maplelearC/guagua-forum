<template>
  <div class="body">
    <div class="nk-container">
      <!-- 头部 -->
      <Header></Header>

      <!-- 内容 -->
      <div class="main">
        <div class="container pl-5 pr-5 pt-3 pb-3 mt-3 mb-3">
          <form class="mt-5">
            <div class="form-group row">
              <label for="your-email" class="col-sm-2 col-form-label text-right">邮箱:</label>
              <div class="col-sm-10">
                <input type="email" class="form-control" id="your-email" placeholder="请输入您的邮箱!" required/>
                <div class="invalid-feedback">该邮箱已被注册!</div>
              </div>
            </div>
            <div class="form-group row mt-4">
              <label for="verifycode" class="col-sm-2 col-form-label text-right">验证码:</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" id="verifycode" placeholder="请输入验证码!"/>
                <div class="invalid-feedback">验证码不正确!</div>
              </div>
              <div class="col-sm-4">
                <a href="javascript:;" class="btn btn-info form-control">获取验证码</a>
              </div>
            </div>
            <div class="form-group row mt-4">
              <label for="your-password" class="col-sm-2 col-form-label text-right">新密码:</label>
              <div class="col-sm-10">
                <input type="password" class="form-control" id="your-password" placeholder="请输入新的密码!" required/>
                <div class="invalid-feedback">密码长度不能小于8位!</div>
              </div>
            </div>
            <div class="form-group row mt-4">
              <div class="col-sm-2"></div>
              <div class="col-sm-10 text-center">
                <button type="submit" class="btn btn-info text-white form-control">
                  重置密码
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- 尾部 -->
      <Footer></Footer>
    </div>
  </div>
</template>


<script>

</script>
<style scoped>
footer {
  bottom: 0;
}
</style>
