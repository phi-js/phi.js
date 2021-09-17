<template>
  <div class="AcademicCourseLinks">
    <template v-if="academicCourse">
      <div class="linked-courses">
        <UiItem
          v-for="link in academicCourse.links"
          :key="link.id"
          icon="mdi:book"
          :text="link.linkedCourse.objSubject.name"
          :secondary="link.linkedCourse.name"
        >
          <template #right>
            <UiIcon
              class="ui-clickable"
              value="mdi:close"
              @click="onClickDelete(link)"
            />
          </template>
        </UiItem>
      </div>

      <V3AcademicCoursePicker
        v-if="academicCourse && academicCourse.year"
        :year-id="academicCourse.year"
        @pick-course="onPickCourse"
        :placeholder="placeholder"
      />
    </template>
  </div>
</template>

<script>
import useApi from '@/modules/api/mixins/useApi.js';
import apiAcademicCourse from '@/modules/v3/api/academic/course.js';
import V3AcademicCoursePicker from '@/modules/v3/components/V3AcademicCoursePicker/V3AcademicCoursePicker.vue';
import { UiItem, UiIcon } from '@/modules/ui/components';

export default {
  name: 'AcademicCourseLinks',
  mixins: [useApi],
  $api: apiAcademicCourse,

  components: { V3AcademicCoursePicker, UiItem, UiIcon },

  props: {
    academicCourseId: {
      type: String,
      required: true,
    },

    placeholder: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      academicCourse: null,
    };
  },

  watch: {
    academicCourseId: {
      immediate: true,
      handler() {
        this.fetchAcademicCourse();
      },
    },
  },

  methods: {
    async fetchAcademicCourse() {
      let response = await this.$api.getCourseWithLinks(this.academicCourseId);

      if (Array.isArray(response) && response.length) {
        this.academicCourse = response[0];
      }

      if (!this.academicCourse.links) {
        this.academicCourse.links = [];
      }
    },

    async onPickCourse(course) {
      let createdLink = await this.$api.putLink(
        this.academicCourseId,
        course.id
      );

      this.academicCourse.links.push({
        ...createdLink,
        linkedCourse: course,
      });
    },

    async onClickDelete(link) {
      if (!confirm('Desasociar este curso ?')) {
        return;
      }

      await this.$api.deleteLink(link.id);

      this.academicCourse.links.splice(
        this.academicCourse.links.indexOf(link),
        1
      );
    },
  },
};
</script>