<template>
  <v-card
      class="mx-auto"
      tile
      style="width: 70%; padding: 20px; margin-left: auto; margin-right: auto; margin-top: 20px"
  >
    <v-list-item>
      <v-list-item-content>
        <header style="font-weight: bold; font-size: 20px">Instructions:</header>
        <header style="font-weight: normal; font-size: 18px">*Make sure you are signed in and add the labels to gmail before doing anything.
        This app is only for creating the "has word", "to", "from" filters in gmail all in one.</header>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title style="font-weight: bold;">1. GMail Label</v-list-item-title>
        <v-list-item-content>Firstly if you see the button the top right still says sign in, you should click that.
        You need to be signed into your Google account so we can retrieve the list of labels. When you are signed in
        you can use the first input box to search/select the desired label you want these filters to be applied to</v-list-item-content>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title style="font-weight: bold;">2. PID</v-list-item-title>
        <v-list-item-content>
          Next you will need to enter the short code for the PID/partner name (ex. ABCD). This is the equivalent to the
          "has word" filter in gmail. It will make a filter to flag any emails containing the PID name!
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title style="font-weight: bold;">3. Email List (optional)</v-list-item-title>
        <v-list-item-content>
          When I was trying to add filters manually I got a wave of feeling I was wasting time. this field is the main reason I
          wanted to make this app lol. I know some filters don't have emails so for them just leave this field blank. However if you want to add an
          email here you can do so and a filter will get created for both the "to" and "from" fields separately as you do already. If you
          want to add multiple at once you can do so! Make sure they are separate with a semi-colon ";" and a space character after
          just like this: "email@gmail.com; email2@gmail.com". PLEASE DON'T leave a semi colon and or space character at the END of the LIST like this:
          "email@gmail.com; " because it will cause an error when you are trying to finish.
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title style="font-weight: bold;">4. Add Filter to List</v-list-item-title>
        <v-list-item-content>
          Okie dokie you have filled in all of the fields listed above. Now simply press the green button to add it to the list.
          You can view the list of "filters to be created" underneath all of the buttons. Each column in the table represents the input
          field you filled out.
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title style="font-weight: bold;">5. Clear filter list</v-list-item-title>
        <v-list-item-content>
          Probably pretty self explanatory but this button clears your list of filters to be created
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title style="font-weight: bold;">6. Download</v-list-item-title>
        <v-list-item-content>
          Finally you have entered all of your info. Now click that download button and you will see a file being downloaded called
          "filters.xml". This file contains all the info you entered as gmail filters.
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title style="font-weight: bold;">7. How to upload filters to GMAIL!</v-list-item-title>
        <v-list-item-content>
          Simply go to gmail and click the settings icon (cog wheel) located on the top right. Then click "see all settings"
          next click the tab labeled "Filters and Blocked Addresses". Scroll down the page and click "import filters". You
          will see new buttons pop up. Click the choose file and find that file that was downloaded in the previous step ("filters.xml").
          Next click open file and you will see all the filters loaded. Feel free to verify them as you wish (or just trust me aka Jason Bourne).
          If everything looks good click that "Create Filters" button and it will make them all at once.
        </v-list-item-content>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "Instructions"
}
</script>

<style scoped>

</style>
