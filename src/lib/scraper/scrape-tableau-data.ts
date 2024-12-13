import axios from 'axios'
import * as cheerio from 'cheerio'
import type {
  TableauSheetConfig,
  ViewDataTablePagePresModel,
  VqlQueryResponse,
} from './types'

const createFormData = (data: Record<string, string>) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return formData
}

const assembleData = (model: ViewDataTablePagePresModel) => {
  const data = model.viewDataColumnValuesPresModels[0].formatValIdxs.map(
    (_, i) => {
      const row = model.viewDataColumnValuesPresModels.reduce<
        Record<string, string>
      >((acc, column) => {
        const columnValueIndex = column.formatValIdxs[i]
        const value =
          model.dataDictionary.dataSegments[0].dataColumns[0].dataValues[
            columnValueIndex
          ]
        return {
          ...acc,
          [column.fieldCaption]: value,
        }
      }, {})

      return row
    },
  )
  return data
}

const baseUrl =
  'https://publicdashboards.dl.usda.gov/vizql/t/MRP_PUB/w/VS_Avian_HPAIConfirmedDetections2022/v/HPAI2022ConfirmedDetections'

const sessionStartPath = (sessionId: string = '0') =>
  `/startSession/sessions/${sessionId}/viewing`
const bootstrapSessionPath = (sessionId: string) =>
  `/bootstrapSession/sessions/${sessionId}`
const lanchDataViewPath = (sessionId: string) =>
  `/sessions/${sessionId}/commands/tabdoc/launch-hybrid-view-data-dialog`
const dataTablePath = (sessionId: string) =>
  `/sessions/${sessionId}/commands/tabdoc/get-view-data-dialog-tab-pres-model`
const exportToServerPath = (sessionId: string) =>
  `/sessions/${sessionId}/commands/tabsrv/export-view-data-summary-to-csv-server`
const exportFilePath = (sessionId: string) => `/tempfile/sessions/${sessionId}`

export const scrapeTableauData = async <T>(baseUrl: string): Promise<T> => {
  const client = axios.create({
    baseURL: baseUrl,
  })

  const sessionStartResponse = await client.post(
    sessionStartPath(),
    undefined,
    {
      params: {
        embed: 'y',
        isGuestRedirectFromVizportal: 'y',
        redirect: 'auth',
      },
    },
  )

  const { sessionid: sessionId, sheetId } = sessionStartResponse.data

  await client.post(bootstrapSessionPath(sessionId), undefined, {
    params: {
      sheet_id: sheetId,
    },
  })

  // const launchDataViewRes = await client.post(
  //   lanchDataViewPath(sessionId),
  //   createFormData({
  //     dataProviderType: 'selection',
  //     visualIdPresModel: JSON.stringify({
  //       // TODO: make this configurable
  //       worksheet: 'A Table by Confirmation Date',
  //       dashboard: 'HPAI 2022 Confirmed Detections',
  //     }),
  //   }),
  // )

  const dataTableRes = await client.post(
    dataTablePath(sessionId),
    createFormData({
      dataProviderType: 'selection',
      datasource: 'sqlproxy.0qr5woy10ed6k71cdm0ny19ufmg6',
      connectionName: 'sqlproxy.0qr5woy10ed6k71cdm0ny19ufmg6',
      isSummaryTable: 'true',
      visualIdPresModel: JSON.stringify({
        worksheet: 'A Table by Confirmation Date',
        dashboard: 'HPAI 2022 Confirmed Detections',
      }),
    }),
  )

  const dataRes = dataTableRes.data

  if (
    !dataRes.vqlCmdResponse.cmdResultList[0].commandReturn
      .viewDataDialogTabPresModel
  )
    throw new Error('Could not find command return')

  const data = assembleData(
    dataRes.vqlCmdResponse.cmdResultList[0].commandReturn
      .viewDataDialogTabPresModel.viewDataTablePagePresModel,
  )

  return data as T
}
