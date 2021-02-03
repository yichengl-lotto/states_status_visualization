<template>
  <div class="home">
    <b-jumbotron
      fluid
      bg-variant="dark"
      text-variant="black"
      border-variant="light"
      class="background"
      style="background-image: url('background.jpg')"
    >
      <b-container fluid>
        <b-row align-v="center">
          <b-col md="6" lg="6">
            <h1>Pivot</h1>
            <h1>Point</h1>
            <p>
              Choosing an undergraduate school is one of the most important
              decisions a student can make.--One that will have a profound
              effect on your life.
            </p>
          </b-col>
          <b-col md="6" lg="6">
            <h2>WE ARE</h2>
            <h2>HERE</h2>
            <h2>TO HELP</h2>
          </b-col>
        </b-row>
      </b-container>
    </b-jumbotron>

    <b-container>
      <b-row align-v="center" class="my-5">
        <b-col lg="5">
          <img width="100%" src="location.jpg" />
        </b-col>
        <b-col>
          <h5 style="text-align: left">Location</h5>
          <p style="text-align: left">
            Research shows that more than 50% of students will stay in the state
            where they graduated. Location plays a major role in your life
            experience. The state, the size of the city, and the local
            community, all impact your years at school and years after you
            graduated. For example, an urban university might offer you more big
            business internship opportunities, or larger non-for-profit
            internships, while a school in a smaller town might have a very
            large campus and more on campus activities and opportunities. Things
            like this are crucial to consider in order to make the right choice
            in choosing your perfect college.
          </p>
          <p>
            Find out the information of each state
            <b-link
              to="/state"
              style="text-decoration: underline; color: black"
              >here.</b-link
            >
          </p>
        </b-col>
      </b-row>
      <b-row class="my-5">
        <b-card-group deck>
          <b-card
            img-src="income.jpg"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem"
            class="mb-2"
          >
            <b-card-title>
              <b-link href="/income">Household Income</b-link>
            </b-card-title>
            <b-card-text>
              To decide if a state is good for living, the economic status of
              the state is one of the key factors. Household income and wage
              distribution data can help students to estimate the overall future
              income if they choose to stay in the state.
            </b-card-text>
          </b-card>
          <b-card
            img-src="expense2.jpg"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem"
            class="mb-2"
          >
            <b-card-title>
              <b-link href="/expense">Life Expense</b-link>
            </b-card-title>

            <b-card-text>
              Life Expense will be a part of financial consideration of
              selecting universities for the students.
            </b-card-text>
          </b-card>
          <b-card
            img-src="school2.jpg"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem"
            class="mb-2"
          >
            <b-card-title>
              <b-link href="/school">Top 200 Univeristy</b-link>
            </b-card-title>

            <b-card-text>
              Rank of university plays a key role for students. Since you may
              meet excellent professors and students here so that you can access
              to better learning environment. Therefore the rank of university
              should be placed on the obvious position.
            </b-card-text>
          </b-card>
          <b-card
            img-src="job.jpg"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem"
            class="mb-2"
          >
            <b-card-title>
              <b-link href="/industry">Job distribution</b-link>
            </b-card-title>
            <b-card-text>
              Your desired career field can be affected by the location of the
              college you choose. Each state has different leading industries.
              Choosing a state with a leading industry related to your major
              will make it easier to find a job.
            </b-card-text>
          </b-card>
        </b-card-group>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Home",
  data: function () {
    return {};
  },
  methods: {},
  components: {},
  mounted: function () {
    var currentComponent = this;
    var promises = [];
    promises.push(d3.json("us-10m.v1.json"));
    promises.push(d3.json("industryBySex.json"));
    promises.push(d3.json("industryBySexMedianIncome.json"));
    promises.push(d3.json("states_titlecase.json"));
    Promise.all(promises).then(function (values) {
      currentComponent.$store.commit("setIndustryData", values[1]);
      currentComponent.$store.commit("setIndustryIncome", values[2]);
      currentComponent.$store.commit("setUS", values[0]);
      currentComponent.$store.commit("setIdToState",values[3])
    })
  },
};
</script>
<style scoped>
.home {
  position: absolute;
  top: 0;
  width: 100%;
}
.background {
  font-family: "Monoton", sans-serif;
  font-weight: bold;
  color: aliceblue;
  background-color: #cccccc;
  min-height: 500px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}
.background h1 {
  font-size: 6rem;
}
.background h2 {
  font-size: 4rem;
}
.background p {
  font-family: Avenir;
  font-size: 20px;
  text-transform: capitalize;
}
</style>
