<template>
  <div class="about">
    <StateProfile :state='state' v-if="state"/>
  </div>
</template>

<script>
import StateProfile from "@/components/StateProfile.vue";
export default {
  name: "profile",
  components: {
    StateProfile,
  },
  data: function () {
    return {
      state: null,
      mapData: null,
    };
  },
  mounted: function () {

    var stateid = this.$route.params.id;
    this.state=this.$store.state.idToState[stateid].name
    console.log(this.state)
  },
};
</script>