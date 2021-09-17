// Todos los paths ("content", "components", etc) son relativos al root del proyecto

module.exports = {
  name: 'Planeación Académica',
  sectionDepth: 2,
  components: [
    'src/modules/v3/planeacion/components/PlaneacionDominioManager/PlaneacionDominioManager.vue',
    'src/modules/v3/planeacion/components/PlaneacionProductoManager/PlaneacionProductoManager.vue',
    'src/modules/v3/planeacion/components/PlaneacionProductoPicker/PlaneacionProductoPicker.vue',
    'src/modules/v3/planeacion/components/PlaneacionUnidadManager/PlaneacionUnidadManager.vue',
    'src/modules/v3/planeacion/components/PlaneacionUnidadDesglose/PlaneacionUnidadDesglose.vue',
    'src/modules/v3/planeacion/components/PlaneacionControl/PlaneacionControl.vue',
    'src/modules/v3/planeacion/components/AcademicCourseLinks/AcademicCourseLinks.vue',
    'src/modules/v3/planeacion/components/PlaneacionUnidadGrading/PlaneacionUnidadGrading.vue',
    'src/modules/v3/planeacion/components/UnidadProductoGrading/UnidadProductoGrading.vue',
    'src/modules/v3/planeacion/components/UnidadProductoResults/UnidadProductoResults.vue',
    'src/modules/v3/planeacion/components/PlaneacionUnidadProducto/PlaneacionUnidadProducto.vue',
    'src/modules/v3/planeacion/components/PlaneacionUnidadConsulta/PlaneacionUnidadConsulta.vue',

    'src/modules/v3/planeacion/reevaluacion/components/Reevaluacion/ReevaluacionGrading.vue',
  ]
}