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

export const scrapeTableauData = async <T>(
  baseUrl: string,
  dashboardRoute: string,
): Promise<T> => {
  const client = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  })

  const dashboardRes = await client.get(dashboardRoute, {
    params: {
      ':embed': 'y',
      ':showAppBanner': 'false',
      ':showShareOptions': 'true',
      ':display_count': 'no',
      showVizHome: 'no',
    },
  })

  const dashboardHtml = cheerio.load(dashboardRes.data as string)

  const {
    sheetId,
    vizql_root: vizqlRoot,
    sessionid: sessionId,
  } = JSON.parse(
    dashboardHtml('#tsConfigContainer').text(),
  ) as TableauSheetConfig

  const createSessionRoute = `${vizqlRoot}/bootstrapSession/sessions/${sessionId}`
  const dataDialogViewRoute = `${vizqlRoot}/sessions/${sessionId}/commands/tabdoc/launch-hybrid-view-data-dialog`
  const dataDialogModelRoute = `${vizqlRoot}/sessions/${sessionId}/commands/tabdoc/get-view-data-dialog-tab-pres-model`

  await client.post(
    createSessionRoute,
    createFormData({
      sheet_id: sheetId,
    }),
  )

  const dataDialogViewRes = (
    await client.post(
      dataDialogViewRoute,
      createFormData({
        dataProviderType: 'selection',
      }),
    )
  ).data as VqlQueryResponse

  const dataDialogModelPayload =
    dataDialogViewRes.vqlCmdResponse.layoutStatus.applicationPresModel.presentationLayerNotification?.find(
      (notification) =>
        notification.keyId === 'doc:launch-hybrid-view-data-dialog-event',
    )?.presModelHolder?.genViewDataDialogPresModel?.dataProviderPresModel

  if (!dataDialogModelPayload)
    throw new Error('Could not find data provider pres model')

  const { visualIdPresModel, ...dataDialogModelQuery } = dataDialogModelPayload

  const dataRes = (
    await client.post(
      dataDialogModelRoute,
      createFormData({
        ...dataDialogModelQuery,
        visualIdPresModel: JSON.stringify(visualIdPresModel),
        viewDataTableId: '',
        isSummaryTable: 'true',
        topN: '100000',
      }),
    )
  ).data as VqlQueryResponse

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
