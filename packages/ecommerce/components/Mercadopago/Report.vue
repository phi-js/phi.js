<template>
  <div class="mercadopago-report">
    <div class="ui-column">
      <ui-field label="Fecha Inicial">
        <ui-input-date v-model="bdate"></ui-input-date>
      </ui-field>

      <ui-field label="Fecha Final">
        <ui-input-date v-model="udate"></ui-input-date>
      </ui-field>

      <ui-field label="Tipo de Transaccion">
        <ui-select v-model="type" :options="types"></ui-select>
      </ui-field>

      <ui-field label="Estado de la Transaccion">
        <ui-select v-model="status" :options="statuses"></ui-select>
      </ui-field>

      <ui-field label="Resultados por pagina">
        <input type="number" min="1" max="350" v-model="limit" />
      </ui-field>

      <ui-field>
        <input
          class="ui-button"
          type="button"
          @click="fetchData(true)"
          value="Generar Reporte"
          :disabled="isDisabled"
        />
      </ui-field>
      <br />
    </div>
    <ui-loading v-if="loading" label="Cargando Reporte"></ui-loading>
    <div v-if="report != null && !loading">
      <div v-show="debug">
        <div>max records: {{ report.paging.total }}</div>
        <div>max total pages: {{ maxpages }}</div>
        <div>current page: {{ current }}</div>
        <div>offset: {{ offset }}</div>
        <div @click="nextPage()">UPPAGE</div>
        <div @click="prevPage()">DOWNPAGE</div>
        <div>TOTAL IN THIS PAGE IS : {{ totalperPage }}</div>
        <div>{{ value }}</div>
      </div>
      <br />
      <div class="exporting_bar">
        <JsonExcel
          class="btn btn-default"
          :data="excelData"
          :fields="excel_fields"
          worksheet="MercadoPago"
          :name="filename()"
        >
          <input class="ui-button" type="button" value="Exportar página actual" />
        </JsonExcel>
        <JsonExcel
          class="btn"
          :fetch="reportAllData"
          :fields="excel_fields"
          worksheet="My Worksheet"
          :name="filename(true)"
        >
          <input class="ui-button" type="button" value="Exportar todo el reporte" />
        </JsonExcel>
      </div>
      <div class="mp-paging">
        <div class="mp-back">
          <ui-icon value="g:navigate_before" v-if="current > 1" @click="prevPage()"></ui-icon>
        </div>
        <div class="mp-text">
          <small>total resultados: {{ report.paging.total }}</small>
          <br />Página
          <span>{{ current }}</span> de
          <span>{{ maxpages }}</span>
        </div>
        <div class="mp-forward">
          <ui-icon value="g:navigate_next" v-if="current < maxpages" @click="nextPage()"></ui-icon>
        </div>
      </div>
      <br />
      <table class="mp-table" cellspacing="0" cellpadding="0" width="100%">
        <thead>
          <td>Usuario</td>
          <td style="text-align:center">Documento usuario</td>
          <td style="text-align:center">Fecha de transaccion</td>
          <td style="text-align:center">Estado</td>
          <td style="text-align:center">Documento en Phidias</td>
          <td style="text-align:center">Documento en Mercadopago</td>
          <td style="text-align:center">Ciclo</td>
          <td style="text-align:center">Valor</td>
        </thead>
        <tr v-for="transaction in report.results" :key="transaction.id" class="ui-selectable">
          <td>
            <a
              v-if="show_links"
              :href="url_client + '/person/details?person=' + transaction.metadata.phidias_user_id"
            >{{ transaction.payer.first_name }} {{ transaction.payer.last_name }}</a>
            <span v-else>{{ transaction.payer.first_name }} {{ transaction.payer.last_name }}</span>
          </td>
          <td
            style="text-align:center"
          >{{ transaction.payer.identification.type }} {{ transaction.payer.identification.number }}</td>
          <td style="text-align:center">{{ formatDate(transaction.date_created) }}</td>
          <td style="text-align:center">{{ langStatus(transaction.status) }}</td>
          <td style="text-align:center">
            <a
              v-if="show_links"
              :href="documentLink(transaction.external_reference)"
            >{{ transaction.external_reference }}</a>
            <span v-else>{{ transaction.external_reference }}</span>
          </td>
          <td style="text-align:center">{{ transaction.id }}</td>
          <td>{{ transaction.transaction_cicle }}</td>
          <td style="text-align:center">{{ formatCurrency(transaction.transaction_amount) }}</td>
        </tr>
        <tr class="last_row">
          <td colspan="6"></td>
          <td style="text-align:right">
            <b>TOTAL:</b>
          </td>
          <td style="text-align:center">{{ formatCurrency(totalperPage) }}</td>
        </tr>
      </table>
    </div>
    <br />
    <br />
  </div>
</template>

<script>
import useApi from "@/modules/api/mixins/useApi";
import mercadoPagoApi from "@/modules/ecommerce/providers/mercadopago/api.js";
// import useI18n from '@/modules/i18n/mixins/useI18n.js';
import {
  UiInput,
  UiSelect,
  UiInputDate,
  UiIcon,
  UiLoading
} from "@/modules/ui/components";

const JsonExcel = () => import("./JsonExcel.vue");

export default {
  name: "mercadopago-report",
  mixins: [useApi],
  api: mercadoPagoApi,
  components: { UiInput, UiSelect, UiInputDate, UiIcon, UiLoading, JsonExcel },
  props: {
    types: {
      type: Array,
      required: false,
      default: () => [
        {
          value: "bcf2fe5e64fd0c4fcb303c381aca975e",
          text: "PSE"
        },
        {
          value: "5c476e7dacd1bc512ddd81e8641f3673",
          text: "Credito"
        }
      ]
    },
    statuses: {
      type: Array,
      required: false,
      default: () => [
        {
          value: "all",
          text: "todos",
          singular: ""
        },
        {
          value: "pending",
          text: "pendientes",
          singular: "pendiente"
        },
        {
          value: "approved",
          text: "aprobadas",
          singular: "aprobada"
        },
        {
          value: "authorized",
          text: "autorizadas",
          singular: "autorizada"
        },
        {
          value: "in_process",
          text: "en proceso",
          singular: "en proceso"
        },
        {
          value: "in_mediation",
          text: "en mediacion",
          singular: "en mediacion"
        },
        {
          value: "rejected",
          text: "rechazadas",
          singular: "rechazada"
        },
        {
          value: "cancelled",
          text: "canceladas",
          singular: "canceladas"
        }
      ]
    },
    access_token: {
      type: String,
      required: false,
      default:
        "APP_USR-419083739902655-072101-d843e9c54b841619d92d33103c62f072-453334848"
    },
    url_client: {
      type: String,
      required: false,
      default: "https://newport.phidias.co"
    },

    show_links: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data() {
    return {
      type: null,
      status: null,
      bdate: new Date(),
      udate: new Date(),
      report: null,
      offset: 0,
      limit: 30,
      current: 1,
      loading: false,
      excel_fields: {
        Usuario: "user",
        Documento: "document",
        "Fecha de Transaccion": "date",
        Estado: "status",
        "Documento en Phidias": "phidias_id",
        "Documento en Mercadopafo": "mp_id",
        Ciclo: "cicle",
        Valor: "value"
      }
    };
  },
  computed: {
    value() {
      // begining of day
      this.bdate = new Date(this.bdate.setHours(0, 0, 0, 0));
      // end of day
      this.udate = new Date(this.udate.setHours(23, 59, 59, 999));

      // console.log('esta es la fecha de donde ', this.bdate);
      // console.log('esta es la fecha de hasta ', this.udate);

      return {
        access_token: this.access_token,
        type: this.type,
        status: this.status,
        offset: this.offset,
        limit: this.limit,
        bdate: this.bdate.toISOString(),
        udate: this.udate.toISOString()
      };
    },

    maxpages() {
      return this.report.paging != null
        ? Math.ceil(this.report.paging.total / this.report.paging.limit)
        : 0;
    },

    totalperPage() {
      let total = 0;
      this.report.results.forEach(element => {
        total = total + element.transaction_amount;
      });
      return total;
    },

    debug() {
      let url = new URL(window.location.href);
      return url.searchParams.has("debug");
      // return true;
    },

    isDisabled() {
      if (this.status != null) {
        return false;
      }
      return true;
    },

    excelData() {
      let excelObject = {};
      if (this.report != null) {
        let data = [];
        let vtotal = 0;

        this.report.results.forEach(element => {
          let object = {
            user:
              element.payer.first_name && element.payer.first_name
                ? element.payer.first_name + " " + element.payer.last_name
                : "",
            document: element.payer.identification.number
              ? element.payer.identification.type + " " + element.payer.identification.number
              : "",
            date: this.formatDate(element.date_created),
            status: this.langStatus(element.status),
            phidias_id: element.external_reference,
            mp_id: element.id,
            cicle: "",
            value: this.formatCurrency(element.transaction_amount)
          };
          data.push(object);
          vtotal += element.transaction_amount;
        });

        let totalRow = {
          user: "",
          document: "",
          date: "",
          status: "",
          phidias_id: "",
          mp_id: "",
          cicle: "<b>TOTAL</b>",
          value: vtotal
        };
        data.push(totalRow);

        excelObject = data;
      }
      // console.log(excelObject);
      return excelObject;
    }
  },

  methods: {
    nextPage() {
      if (this.current < this.maxpages) {
        this.current = this.current + 1;
        this.offset = this.offset + parseInt(this.limit) + 1;
        this.fetchData();
      }
    },

    prevPage() {
      if (this.offset > 0) {
        this.current = this.current - 1;
        this.offset = this.offset - parseInt(this.limit) - 1;
        this.fetchData();
      }
    },

    formatDate(dateString) {
      let date = new Date(dateString);
      // return this.$date(date);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },

    formatCurrency(value) {
      return new Intl.NumberFormat({ style: "currency" }).format(value);
    },

    langStatus(oValue) {
      if (oValue == "") {
        return "";
      }

      let value = this.statuses.find(option => option.value === oValue)
        .singular;

      // console.log('este es el valor del registro ', oValue);
      // console.log('este el objeto que retorno de statuses ',  value);

      return value;
    },

    documentLink(documentId) {
      let moduleUrl = "/debit/details?debit=";

      if (documentId.charAt(0) === "4") {
        moduleUrl = "/debit/group/details?group=";
      }

      return this.url_client + moduleUrl + documentId.substr(1);
    },

    async fetchData(fromzero = false) {
      // console.log(this.value);

      // console.log(typeof(this.bdate));

      if (fromzero) {
        this.offset = 0;
        this.current = 1;
      }

      this.loading = true;
      this.report = await this.$api.getPaymentsReport(this.value);
      this.loading = false;
    },

    /* this function will operate a full fetch for a report already generated
     * meaning.. it will take the total amount of results and fetch the same report
     * with a limit equal to that total, producing in result all data available for the query...
     */
    async reportAllData() {
      if (this.report.paging.total != this.limit && this.report) {
        this.limit = this.report.paging.total;
        await this.fetchData()
      }
      return this.excelData;
    },

    filename(total = false) {
      // console.log(this.bdate.toISOString());
      // console.log(this.bdate);
      if (total) {
        return (
          "mercadopagoReport_" +
          Math.round(this.bdate.getTime() / 1000) +
          "-" +
          Math.round(this.udate.getTime() / 1000) +
          ".xls"
        );
      }
      return (
        "mercadopagoReport_" +
        Math.round(this.bdate.getTime() / 1000) +
        "-" +
        Math.round(this.udate.getTime() / 1000) +
        "_PAG" +
        this.current +
        "OF" +
        this.maxpages +
        ".xls"
      );
    }
  }
};
</script>

<style lang="scss">
.mp-table {
  margin: 15px;
  & > thead {
    & > td {
      font-weight: bold;
    }
  }
  & > tr {
    &.last_row > td {
      border-top: 1px solid #cccccc;
    }
    & > td {
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }
}
.mp-paging {
  text-align: center;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}
.mp-forward {
  cursor: pointer;
  font-size: 15pt;
  margin-left: 25px;
}
.mp-back {
  cursor: pointer;
  font-size: 15pt;
  margin-right: 25px;
}

.exporting_bar {
  display: flex;
  justify-content: flex-end;
}
</style>