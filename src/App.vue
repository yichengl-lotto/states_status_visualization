<template>
  <div id="app">
    <b-navbar toggleable="lg" style="z-index:1050" type="light" id="nav">
    <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mx-auto">
          <b-nav-item to="/state">States</b-nav-item>
          <b-nav-item to="/industry" >Industry</b-nav-item>
          <b-nav-item to="/income" >Income</b-nav-item>
        </b-navbar-nav>
      </b-collapse>

      <b-navbar-brand class="brand" to="/">Pivot Point</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mx-auto" >
          <b-nav-item to="/expense">Life Expense</b-nav-item>
          <b-nav-item to="/school" >School</b-nav-item>
        </b-navbar-nav>
      </b-collapse>

    </b-navbar>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: white;
}


#nav a {
  font-weight: bold;
  font-size:1rem;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#nav a.brand{
  font-size:2rem;
}
</style>
