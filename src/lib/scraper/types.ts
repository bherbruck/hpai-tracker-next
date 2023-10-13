export type TableauSheetConfig = {
  revisionInfo: null
  facebookAppID: string
  allow_select: boolean
  allow_filter: boolean
  allow_sheetlink: boolean
  allow_highlight: boolean
  allow_tooltip: boolean
  allow_view_underlying: boolean
  allow_summary: boolean
  allow_commenting: boolean
  allow_commenting_mentions: boolean
  allow_add_comment: boolean
  allow_view_comments: boolean
  allow_connected_experience: boolean
  allow_custom_views: boolean
  allow_custom_view_default: boolean
  allow_custom_view_share: boolean
  allow_custom_view_save: boolean
  allow_authoring: boolean
  allow_data_alert: boolean
  allow_view_data_alerts: boolean
  allow_metrics_button: boolean
  allow_metrics_snapshotting: boolean
  allow_create_metric: boolean
  allow_create_refresh_metrics: boolean
  allow_explain_data: boolean
  allow_delete_comment: boolean
  allow_cataloging: boolean
  allow_named_sharing: boolean
  allow_personal_space_only: boolean
  allow_save: boolean
  allow_save_as: boolean
  allow_save_data_source: boolean
  allow_subscriptions: boolean
  workbook_allow_subscriptions: boolean
  allow_subscribe_others: boolean
  allow_subscription_attachments: boolean
  allow_add_new_datasource: boolean
  allow_export_image: boolean
  allow_export_data: boolean
  workbook_owner_friendly_name: string
  workbook_owner_user_name: string
  is_guest: boolean
  is_admin: boolean
  is_request_access_enabled: boolean
  is_revision_history_preview: boolean
  current_user_email: null
  current_user_id: number
  current_user_friendly_name: string
  current_user_domain_name: string
  current_user_name: string
  current_user_image_url: null
  current_user_nlp_help_center_stage: null
  current_custom_view_id: null
  current_custom_view_name: null
  current_custom_view_created_by_feature: null
  disableUrlActionsPopups: boolean
  vizql_root: string
  site_root: string
  site_url_name: string
  site_name: string
  site_luid: string
  is_ask_data_disabled_for_site: boolean
  is_data_monitoring_ui_enabled: boolean
  is_data_monitoring_admin_ui_enabled: boolean
  is_data_monitoring_author_configuration_ui_enabled: boolean
  composite_sizes: CompositeSizes
  view_sizes: ViewSizes
  dsd_phone_max_size: number
  dsd_tablet_max_size: number
  visible_sheets: string[]
  is_mobile: boolean
  is_mobile_user_agent: boolean
  is_mobile_app: boolean
  is_on_prem_deep_linking_enabled: boolean
  is_authoring: boolean
  is_viewDataClient: boolean
  is_metrics_authoring: boolean
  is_metrics_view: boolean
  is_metrics_enabled: boolean
  is_web_zones_enabled: boolean
  is_workflow_extension_enabled: boolean
  is_data_orientation_enabled: boolean
  is_mark_animation_enabled: boolean
  is_mark_animation_enabled_for_server: boolean
  should_auto_show_data_orientation_pane: boolean
  should_suppress_data_orientation_auto_open: boolean
  repository_urls: string[]
  origin_repository_url: string
  workbook_repo_url: string
  external_workbook_url: string
  tabs_allowed: boolean
  showTabsWorkbook: boolean
  current_project_id: number
  current_location: null
  current_sheet_name: string
  current_sheet_type: string
  current_workbook_id: number
  current_workbook_luid: string
  current_workbook_twbx_size: number
  has_nlp_permitted_datasources: boolean
  current_view_id: string
  current_view_luid: string
  sheetId: string
  showParams: string
  stickySessionKey: string
  filterTileSize: number
  locale: string
  userTimeZoneId: string
  userTimeZoneDisplayName: string
  workbookLocale: null
  browser_rendering_threshold: number
  language: string
  version: string
  externalVersion: string
  is_saas: boolean
  contact_support_uri: string
  clear_session_on_unload: boolean
  lyteboxedVizWidth: number
  facebookRedirectURI: string
  facebookDescription: string
  is_browser_rendering_requested: boolean
  bootstrapOnMouseover: boolean
  bootstrapWhenNotified: boolean
  show_byline: boolean
  forceToolbarTop: boolean
  sessionid: string
  sessionIdHash: string
  layoutid: string
  toolbarContainerVis: boolean
  toolbarvis: boolean
  toolbarvisDefault: boolean
  linktarget: null
  watermarklink: string
  requestURI: string
  blogURI: string
  embeddedTitle: string
  embedded: boolean
  staticImage: string
  baseViewThumbLink: string
  isPublic: boolean
  telemetryEndPointOverride: string
  previewMode: boolean
  downloadURI: string
  downloadURIReadonly: string
  serverName: string
  showTabs: boolean
  showTabsDefault: boolean
  repositoryUrl: string
  parentID: null
  guid: string
  primaryContentUrl: null
  shareDescription: string
  statefulURL: boolean
  showLytebox: null
  showShareOptions: boolean
  showViewCount: boolean
  viewCountThreshold: number
  workbookName: string
  syncSession: null
  external_static_asset_prefix: string
  local_static_asset_prefix: string
  animateTransition: boolean
  serverUrlPrefix: string
  corsProxyHeaderPrefix: string
  loadOrderID: number
  apiID: string
  embeddingV3: boolean
  apiInternalVersion: null
  apiExternalVersion: null
  askDataWebComponent: boolean
  reloadOnCustomViewSave: boolean
  highDpi: boolean
  pixelRatio: null
  schemeWhitelist: string
  useOfflineHelp: boolean
  showVizHome: boolean
  formatDataValueLocally: boolean
  deviceTypeOverride: string
  metricsReportingEnabled: boolean
  resourceEntryBufferSize: number
  metricsServerHostname: string
  metricsFilter: string
  metricsIncludeVizclientSessionId: boolean
  enableTelemetryForGuestUser: boolean
  clientErrorReportingLevel: string
  clientErrorReportingMaxRequestSizeBytes: number
  forceHttpsForPublicEmbed: boolean
  openAuthoringInTopWindow: boolean
  browserBackButtonUndo: boolean
  commentingEnabled: boolean
  commentingMentionsEnabled: boolean
  isVizPortal: boolean
  debugMode: boolean
  self_service_schedules_enabled: boolean
  user_time_zone_enabled: boolean
  display_schedules_in_client_timezone: boolean
  display_schedule_description_as_name: boolean
  keychain_version: number
  features_json: string
  features: { [key: string]: boolean }
  serverPlatform: string
  xdomain_active: boolean
  isBeta: boolean
  vizqlserver_session_inactivity_timeout_minutes: number
  offlineBootstrapResponse: null
  clientCheckBugText: null
  clientCheckBugUrl: null
  clientOpenBugText: null
  clientOpenBugUrl: null
  showAppBanner: boolean
  cssStaticAssetFiles: any[]
  jsStaticAssetFiles: string[]
  staticAssetVersion: string
  shareProductUsageDataEnabled: boolean
  nlpLayoutMode: string
  nlpFeedbackMode: string
  lensLuid: null
  lensId: number
  lensName: null
  lensRepoUrl: null
  lensAssociatedDatasourceId: number
  useLocalPaths: boolean
  viewCount: number
  nlpAllowTelemetry: boolean
  nlpAllowParserTelemetry: boolean
  requireCredentialsPromptForSave: boolean
  showAskData: boolean
  allowLiveConnections: boolean
  allowBackgroundExtractCreation: boolean
  allowExtractAuthoring: boolean
  allowExtractSettings: boolean
  workbookRetrieveMode: string
  vizqlSessionType: string
  workbookLastPublishedAt: Date
  workbookContentVersion: number
  connectionDialogTabsFlags: number
  is_explain_data_enabled_for_site: boolean
  is_data_story_enabled: boolean
  showAcceleration: boolean
  alwaysUseEmbeddedShareLinks: boolean
  enhancedAccelerationTooltip: boolean
  shareSiteLuidEnabled: boolean
}

export type CompositeSizes = {
  tablet: Desktop
  desktop: Desktop
  phone: Desktop
  phoneAutogen: Desktop
}

export type Desktop = {
  maxHeight: number
  maxWidth: number
  minHeight: number
  minWidth: number
}

export type ViewSizes = {
  [name: string]: CompositeSizes
}

export type VqlQueryResponse = {
  vqlCmdResponse: VqlCmdResponse
}

export type VqlCmdResponse = {
  layoutStatus: LayoutStatus
  cmdResultList: CmdResultList[]
}

export type CmdResultList = {
  commandName: string
  commandReturn: CommandReturn
}

export type CommandReturn = {
  viewDataDialogTabPresModel?: ViewDataDialogTabPresModel
}

export type ViewDataDialogTabPresModel = {
  viewDataTableId: string
  allColumns: string[]
  underlyingDataTableColumns: UnderlyingDataTableColumn[]
  viewDataTablePagePresModel: ViewDataTablePagePresModel
  totalRowCount: number
}

export type UnderlyingDataTableColumn = {
  dataType: string
  fieldCaption: string
  fn: string
  isReferenced: boolean
  valueIndices: any[]
  formatValIdxs: any[]
  aliasIndices: any[]
  fieldIconRes: string
  tableCaption: string
}

export type ViewDataTablePagePresModel = {
  pageInfo: PageInfo
  viewDataColumnValuesPresModels: ViewDataColumnValuesPresModel[]
  dataDictionary: DataDictionary
}

export type DataDictionary = {
  dataSegments: DataSegments
}

export type DataSegments = {
  [name: string]: The0
}

export type The0 = {
  dataColumns: DataColumn[]
}

export type DataColumn = {
  dataType: string
  dataValues: string[]
}

export type PageInfo = {
  rowIndex: number
  columnIndex: number
  uRowCount: number
  uColumnCount: number
}

export type ViewDataColumnValuesPresModel = {
  uniqueName: string
  fieldCaption: string
  dataType: string
  valueIndices: any[]
  formatValIdxs: number[]
}

export type LayoutStatus = {
  active_tab: string
  isViewModified: boolean
  undoPosition: number
  urlActionList: any[]
  vizStateList: any[]
  applicationPresModel: ApplicationPresModel
  isWorldNew: boolean
  guid: string
}

export type ApplicationPresModel = {
  renderMode: string
  dateFormat: string
  timeFormat: string
  numberFormats: string[]
  presentationLayerNotification?: PresentationLayerNotification[]
  dashboardObjectsLibrary: any[]
}

export type PresentationLayerNotification = {
  keyId: string
  presModelHolder: PresModelHolder
}

export type PresModelHolder = {
  genViewDataDialogPresModel?: GenViewDataDialogPresModel
  genModifiedDataSourcesPresModel?: GenModifiedDataSourcesPresModel
}

export type GenModifiedDataSourcesPresModel = {
  dataSourceNames: any[]
  updateDataQualityWarnings: boolean
}

export type GenViewDataDialogPresModel = {
  viewDataDialogTitle: string
  viewDataDialogTableIdWithCaptionList: ViewDataDialogTableIDWithCaptionList[]
  dataProviderPresModel: DataProviderPresModel
  isDesktop: boolean
  topN: number
  isExportSupported: boolean
  areAliasesSupported: boolean
  isShowFieldsSupported: boolean
}

export type DataProviderPresModel = {
  dataProviderType: string
  datasource: string
  connectionName: string
  sqlQuery: string
  tableName: string
  visualIdPresModel: VisualIDPresModel
}

export type VisualIDPresModel = {
  worksheet: string
  dashboard: string
}

export type ViewDataDialogTableIDWithCaptionList = {
  viewDataTableId: string
  viewDataTableCaption: string
  isSummaryTable: boolean
  viewDataTableIconType: string
}
