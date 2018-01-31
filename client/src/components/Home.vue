<template>
  <div>
    <!-- Landing page view -->
    <custom-section class="hero is-info is-fullheight" :title="websiteTitle" :subtitle="websiteSubtitle" />
    <!-- About section -->
    <custom-section class="section" id="about">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            About Us
          </h1>
          <div class="columns">
            <div class="column">
              <p>Mediscan provides a way to help patients and caregivers with their medication timings. Patients scan the QR
                code of a prescription to quickly set up reminders and to keep everyone in the loop.</p>
            </div>
            <div class="column">
              <p>This is built by a team of passionate engineers:</p>
              <ul>
                <li v-for="contributor in contributors" v-bind:key="contributor.name">
                  {{contributor.name}} -
                  <a :href="contributor.link" aria-label="more options" target="_blank">
                    Github
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </custom-section>
    <!-- Solution section -->
    <custom-section class="section is-large">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Our solution
          </h1>
          <div class="columns">
            <div class="column">1</div>
            <div class="column">2</div>
            <div class="column">3</div>
          </div>
        </div>
      </div>
    </custom-section>
  </div>
</template>

<script>
  import CustomSection from './Section.vue'

  import 'vue-awesome/icons/github'
  import Icon from 'vue-awesome/components/Icon'

  export default {
    name: 'home',
    data () {
      return {
        websiteTitle: 'Mediscan',
        websiteSubtitle: 'QR code reminder system for medications',
        contributors: [{
          name: 'Leonard Loo',
          link: 'https://github.com/leonardloo'
        },
        {
          name: 'Jean Tan',
          link: 'https://github.com/jeantanzj'
        },
        {
          name: 'Li Wei',
          link: 'https://github.com/iewil'
        },
        {
          name: 'Wei Wen',
          link: 'https://github.com/goweiwen'
        },
        {
          name: 'Joshua Yap',
          link: 'https://github.com/ratsjosh'
        },
        {
          name: 'Tang Kok Foon',
          link: 'https://github.com/soraino'
        },
        {
          name: 'Kevin Chu',
          link: 'https://github.com/1kc'
        }
        ]
      }
    },
    components: {
      CustomSection,
      Icon
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul {
    list-style-type: circle;
    text-align: left;
    margin-left: 20px;
  }
  
  ul li {
    list-style-type: circle;
    text-align: left;
    margin-left: 20px;
  }

  #about .column p {
    text-align: left;
    font-size: 1.25rem;
  }

  #about .column {
    padding: 30px;
    position: relative;
  }

  #about .column:last-child {
    padding-left: 60px;
  }

  #about .column:first-child:after {
    content: '';
    height: 40%;
    width: 1px;

    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(-50%, -50%);

    background-color: #d4d4d4;
  }

</style>
