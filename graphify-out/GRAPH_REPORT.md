# Graph Report - Framework  (2026-04-30)

## Corpus Check
- 4336 files · ~6,981,854 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 9940 nodes · 15504 edges · 81 communities detected
- Extraction: 68% EXTRACTED · 32% INFERRED · 0% AMBIGUOUS · INFERRED: 4986 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 96|Community 96]]

## God Nodes (most connected - your core abstractions)
1. `parse()` - 287 edges
2. `String()` - 262 edges
3. `replace()` - 207 edges
4. `nowIso()` - 155 edges
5. `normalizePrefix()` - 145 edges
6. `all()` - 134 edges
7. `set()` - 128 edges
8. `normalizeActionInput()` - 114 edges
9. `useEffect()` - 103 edges
10. `parseWebhookEvent()` - 102 edges

## Surprising Connections (you probably didn't know these)
- `money()` --calls--> `round()`  [INFERRED]
  admin-panel/backend/src/seed/helpers.ts → plugins/gutu-plugin-erp-actions-core/framework/builtin-plugins/erp-actions-core/src/host-plugin/routes/erp-actions.ts
- `money()` --calls--> `round()`  [INFERRED]
  admin-panel/backend/src/seed/manufacturing-extended.ts → plugins/gutu-plugin-erp-actions-core/framework/builtin-plugins/erp-actions-core/src/host-plugin/routes/erp-actions.ts
- `money()` --calls--> `round()`  [INFERRED]
  admin-panel/backend/src/seed/procurement-extended.ts → plugins/gutu-plugin-erp-actions-core/framework/builtin-plugins/erp-actions-core/src/host-plugin/routes/erp-actions.ts
- `money()` --calls--> `round()`  [INFERRED]
  admin-panel/backend/src/seed/accounting-extended.ts → plugins/gutu-plugin-erp-actions-core/framework/builtin-plugins/erp-actions-core/src/host-plugin/routes/erp-actions.ts
- `listPluginEnablement()` --calls--> `all()`  [INFERRED]
  admin-panel/backend/src/host/tenant-enablement.ts → plugins/gutu-plugin-analytics-bi-core/framework/builtin-plugins/analytics-bi-core/src/host-plugin/routes/analytics-bi.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.01
Nodes (611): accessibleRecordIds(), clampRole(), effectiveRole(), globalRoleCeiling(), grantAcl(), listAcl(), purgeAclForRecord(), revokeAcl() (+603 more)

### Community 1 - "Community 1"
Cohesion: 0.01
Nodes (328): canLaunchZone(), canRunAction(), canSeeField(), canSeeWidget(), canUseBuilder(), canUseCommand(), canViewPage(), canViewReport() (+320 more)

### Community 2 - "Community 2"
Cohesion: 0.01
Nodes (338): cloneAccount(), cloneEntry(), clonePeriod(), createErpAccountingRuntime(), daysBetween(), defaultNormalBalance(), defineErpAccount(), signedAmount() (+330 more)

### Community 3 - "Community 3"
Cohesion: 0.01
Nodes (200): decodeEncodedWords(), formatAddress(), formatAddresses(), normalizeEmail(), parseAddress(), parseAddressList(), participantsHash(), splitAddressList() (+192 more)

### Community 4 - "Community 4"
Cohesion: 0.01
Nodes (219): runOrError(), safeJson(), apiBase(), createEditorRecord(), createPublicLink(), deleteEditorRecord(), fetchEditorRecord(), fetchSnapshot() (+211 more)

### Community 5 - "Community 5"
Cohesion: 0.01
Nodes (174): AdminInner(), AdminRoot(), PermissionsRoot(), PlaygroundUI(), AIInsightPanel(), AppShell(), buildCrumbs(), ExternalViewRenderer() (+166 more)

### Community 6 - "Community 6"
Cohesion: 0.01
Nodes (147): AdvancedDataTable(), loadState(), addLeaf(), AdvancedFilterBuilder(), emit(), emptyLeaf(), isLeaf(), removeAt() (+139 more)

### Community 7 - "Community 7"
Cohesion: 0.01
Nodes (151): fetchAll(), monthKey(), num(), str(), aggregate(), bucketKey(), computeAggregation(), evalFilter() (+143 more)

### Community 8 - "Community 8"
Cohesion: 0.02
Nodes (149): fmtCurrency(), mockKpis(), mockSeries(), normalizeSubject(), fmtCurrency(), mockKpis(), mockSeries(), AiEvalsRunDetailPage() (+141 more)

### Community 9 - "Community 9"
Cohesion: 0.02
Nodes (157): bankAccounts(), bankTransactions(), budgets(), code(), costCenters(), count(), currencyRates(), dunning() (+149 more)

### Community 10 - "Community 10"
Cohesion: 0.02
Nodes (146): runContractScenario(), runLifecycleScenario(), layoutNodes(), setZoom(), CustomFieldInput(), CustomFieldsSection(), display(), String() (+138 more)

### Community 11 - "Community 11"
Cohesion: 0.02
Nodes (102): applyEncryption(), bufferUpTo(), concat(), existsFile(), fromS3StorageClass(), LocalStorageAdapter, nodeToWebStream(), renderPrefix() (+94 more)

### Community 12 - "Community 12"
Cohesion: 0.02
Nodes (79): t(), envEnum(), envFlag(), envInt(), loadConfig(), resetConfig(), locales(), t() (+71 more)

### Community 13 - "Community 13"
Cohesion: 0.03
Nodes (144): normaliseDate(), checkCatalog(), checkPluginDocs(), main(), missingHeadings(), placeholderFailures(), buildImportList(), capitalize() (+136 more)

### Community 14 - "Community 14"
Cohesion: 0.02
Nodes (132): buildAccountingCoreMigrationSql(), buildAccountingCoreRollbackSql(), buildAiAssistCoreMigrationSql(), buildAiAssistCoreRollbackSql(), buildAnalyticsBiCoreMigrationSql(), buildAnalyticsBiCoreRollbackSql(), buildAssetsCoreMigrationSql(), buildAssetsCoreRollbackSql() (+124 more)

### Community 15 - "Community 15"
Cohesion: 0.02
Nodes (93): compileBiQuery(), createBiChart(), createBiDashboard(), createBiSchedule(), createBiShare(), createBiSpace(), drillDownBiQuery(), fetchBiCatalog() (+85 more)

### Community 16 - "Community 16"
Cohesion: 0.03
Nodes (119): buildAccountingCoreSqliteMigrationSql(), buildAccountingCoreSqliteRollbackSql(), buildAiAssistCoreSqliteMigrationSql(), buildAiAssistCoreSqliteRollbackSql(), buildAnalyticsBiCoreSqliteMigrationSql(), buildAnalyticsBiCoreSqliteRollbackSql(), buildAssetsCoreSqliteMigrationSql(), buildAssetsCoreSqliteRollbackSql() (+111 more)

### Community 17 - "Community 17"
Cohesion: 0.04
Nodes (101): assertRepositoryBoundary(), canUseFrameworkSymlink(), collapseExtractedPackageRoot(), commitCatalogPromotion(), computeFileSha256(), copyPublishTree(), createExternalRepositoryFiles(), createWorkspaceLock() (+93 more)

### Community 18 - "Community 18"
Cohesion: 0.04
Nodes (87): createPaymentIdempotencyKey(), AiProviderError, convertZodSchema(), createErrorResponse(), createMcpRuntimeOrchestrator(), createMcpRuntimeServer(), createMcpServerFromContracts(), createSchemaCacheEntry() (+79 more)

### Community 19 - "Community 19"
Cohesion: 0.04
Nodes (9): assertUnsupportedOperation(), normalizeWebhookStatus(), parseGenericWebhookEvent(), readRecordField(), readStatusField(), readStringField(), safeJsonParse(), parseWebhookEvent() (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.04
Nodes (84): bootstrapStorage(), localDefaultConfig(), parseStorageBackendsEnv(), s3DefaultFromEnv(), close(), discoverPluginSpecs(), fromEnv(), fromMonorepo() (+76 more)

### Community 21 - "Community 21"
Cohesion: 0.03
Nodes (4): amendRecord(), placeRecordOnHold(), releaseRecordHold(), reverseRecord()

### Community 22 - "Community 22"
Cohesion: 0.02
Nodes (2): createGeneratedProviderAdapter(), createProviderAdapter()

### Community 23 - "Community 23"
Cohesion: 0.02
Nodes (1): mapProviderStatus()

### Community 24 - "Community 24"
Cohesion: 0.04
Nodes (60): FrameworkRecordLinksAdapter, FrameworkTimelineAdapter, api(), login(), main(), record(), safe(), scenarioAuthGuards() (+52 more)

### Community 25 - "Community 25"
Cohesion: 0.04
Nodes (18): main(), read_cell_value(), read_shared_strings(), asAttachment(), ImageDetail(), onKey(), ImapClient, ImapError (+10 more)

### Community 26 - "Community 26"
Cohesion: 0.05
Nodes (75): buildDependencyContractsFromLists(), dedupeList(), deriveSuggestedPackIds(), main(), renderActions(), renderAdminContributions(), renderAdminPage(), renderBusinessPackAutomation() (+67 more)

### Community 27 - "Community 27"
Cohesion: 0.05
Nodes (60): copyRequestId(), actionRequiredExample(), buildProviderRecord(), classifySupportLevel(), countSeriousImplementedOperations(), createFirstWaveReadinessReport(), createSupportMatrix(), deriveAdvertisedCapabilities() (+52 more)

### Community 28 - "Community 28"
Cohesion: 0.09
Nodes (3): checkPlaceholders(), requireFile(), requireHeadings()

### Community 29 - "Community 29"
Cohesion: 0.05
Nodes (29): AnalyticsEmitterImpl, createAnalytics(), ensureSessionId(), Toolbar(), ToolbarButton(), createRuntime(), cryptoId(), RuntimeProvider() (+21 more)

### Community 30 - "Community 30"
Cohesion: 0.05
Nodes (27): handleApply(), handler(), setLink(), BlockSuitePageAdapter, loadBlockSuite(), BlockSuiteEdgelessAdapter, loadBlockSuite(), FrameEditor() (+19 more)

### Community 31 - "Community 31"
Cohesion: 0.07
Nodes (49): accountingImbalance(), assertSafeJson(), buildErpDocumentRender(), buildErpPostingReport(), buildMappedTargetRecord(), cloneJson(), collectPrintableRecord(), escapeHtml() (+41 more)

### Community 32 - "Community 32"
Cohesion: 0.1
Nodes (11): backoffMs(), collectParticipants(), collectParticipantsFromMessages(), fetchJson(), fetchWithTimeout(), jmapAddrToAddress(), JmapDriver, JmapHttpError (+3 more)

### Community 33 - "Community 33"
Cohesion: 0.13
Nodes (37): aggregateMetric(), aggregateSnapshots(), applyFilters(), applySorts(), clampLimit(), clone(), compareValues(), compileMetricQuerySql() (+29 more)

### Community 34 - "Community 34"
Cohesion: 0.11
Nodes (33): compileDraft(), compileEmailDraft(), createCommunicationIdempotencyKey(), createLocalCommunicationProviderRegistry(), createRetryDecision(), defineCommunicationRoute(), defineInAppCompiler(), definePushCompiler() (+25 more)

### Community 35 - "Community 35"
Cohesion: 0.1
Nodes (29): adaptLegacyUiRegistry(), humanizeSlug(), inferGroupId(), inferPageKind(), inferWorkspaceId(), lastStaticAdminSegment(), toStableId(), createRegistry() (+21 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (31): assertAuditHealthy(), assertCertificationHealthy(), assertConsumerSmokeHealthy(), copyCoreRoot(), copyRepoRoots(), createAuditReport(), createFileLockEntry(), discoverCorePackageIds() (+23 more)

### Community 37 - "Community 37"
Cohesion: 0.09
Nodes (12): normalize(), toSnakeCase(), emptySummary(), sanitizeFilename(), slugify(), validateCreateInput(), countLeaves(), LeafEditor() (+4 more)

### Community 38 - "Community 38"
Cohesion: 0.12
Nodes (27): advances(), appraisals(), attendance(), code(), count(), departments(), designations(), employees() (+19 more)

### Community 39 - "Community 39"
Cohesion: 0.08
Nodes (1): BusinessAdminPage()

### Community 40 - "Community 40"
Cohesion: 0.08
Nodes (1): seedState()

### Community 41 - "Community 41"
Cohesion: 0.17
Nodes (18): createNavigationContract(), findMatchingZone(), isPathPrefixMatch(), listDeepLinks(), matchesRoutePattern(), matchesZone(), normalizeHref(), resolveNavigationTarget() (+10 more)

### Community 42 - "Community 42"
Cohesion: 0.17
Nodes (9): AccessDenied, ChecksumMismatch, InvalidKey, isRetryableByDefault(), isStorageError(), ObjectNotFound, PayloadTooLarge, StorageError (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.17
Nodes (13): bootstrapMailJobs(), registerMailCleanup(), registerMailIndex(), registerMailPush(), ensureIntentTable(), registerMailReconcile(), registerMailSend(), registerMailSnooze() (+5 more)

### Community 44 - "Community 44"
Cohesion: 0.23
Nodes (14): withLeadership(), cronMatches(), ensureRunsTable(), fieldMatches(), getScheduleRunsForTest(), listTimeBasedRules(), recordsWithDateField(), runSchedulerTickForTest() (+6 more)

### Community 45 - "Community 45"
Cohesion: 0.15
Nodes (6): ConfigurationError, NotSupportedError, PaymentError, ProviderError, TransportError, WebhookVerificationError

### Community 46 - "Community 46"
Cohesion: 0.31
Nodes (7): buildCartesianChartOption(), ChartSurface(), countChartSeries(), createBarChartOption(), createLineChartOption(), createStackedBarChartOption(), createTrendChartOption()

### Community 47 - "Community 47"
Cohesion: 0.36
Nodes (7): getPluginUiRecord(), installPluginUiIfNeeded(), readInstalled(), runIsolated(), startPluginUi(), stopPluginUi(), writeInstalled()

### Community 48 - "Community 48"
Cohesion: 0.56
Nodes (7): assertCatalogArtifactPolicy(), assertCatalogShape(), assertChannelShape(), assertPluginPresentationMetadata(), assertRemoteAsset(), assertSignedArtifact(), assertSortedAndUnique()

### Community 49 - "Community 49"
Cohesion: 0.43
Nodes (7): createPlatformTableOptions(), createPlatformTableState(), setPlatformColumnVisibility(), setPlatformFilter(), setPlatformSorting(), togglePlatformRowSelection(), usePlatformTable()

### Community 50 - "Community 50"
Cohesion: 0.32
Nodes (3): assertCoordinates(), calculateBoundingBox(), haversineDistanceKm()

### Community 51 - "Community 51"
Cohesion: 0.33
Nodes (2): DefaultFallback(), PluginBoundary

### Community 52 - "Community 52"
Cohesion: 0.29
Nodes (1): App()

### Community 53 - "Community 53"
Cohesion: 0.48
Nodes (5): DocumentWorkspace(), PagesWorkspace(), SlidesWorkspace(), SpreadsheetWorkspace(), WhiteboardWorkspace()

### Community 54 - "Community 54"
Cohesion: 0.52
Nodes (6): globRoots(), listStandaloneRoots(), listTrackedOffenders(), listVisibleStandaloneStatus(), runGit(), safeList()

### Community 56 - "Community 56"
Cohesion: 0.43
Nodes (5): filterCommandPaletteItems(), groupCommandPaletteItems(), normalizeQuery(), PlatformCommandPalette(), rankCommandPaletteItems()

### Community 57 - "Community 57"
Cohesion: 0.53
Nodes (5): containsLookalike(), looksLikeBrandImpersonation(), parseAuthResults(), phishHeuristics(), splitMethods()

### Community 58 - "Community 58"
Cohesion: 0.33
Nodes (1): intent()

### Community 59 - "Community 59"
Cohesion: 0.33
Nodes (1): asSeries()

### Community 60 - "Community 60"
Cohesion: 0.4
Nodes (2): createSplitWorkspaceFixture(), hasDirectorySymlinkSupport()

### Community 61 - "Community 61"
Cohesion: 0.6
Nodes (5): AdminShell(), getReactRuntime(), PortalShell(), ShellFrame(), SiteShell()

### Community 62 - "Community 62"
Cohesion: 0.47
Nodes (4): createAdminEditorPreset(), createReadOnlyEditorPreset(), ReadOnlyEditorRenderer(), renderReadOnlyEditorContent()

### Community 63 - "Community 63"
Cohesion: 0.7
Nodes (3): attachWorkerRpc(), dispatchWorkerRpc(), spawnWorkerSandbox()

### Community 64 - "Community 64"
Cohesion: 0.4
Nodes (1): EditorErrorBoundary

### Community 65 - "Community 65"
Cohesion: 0.5
Nodes (2): post(), setPosts()

### Community 68 - "Community 68"
Cohesion: 0.6
Nodes (3): addMoney(), sameCurrency(), subtractMoney()

### Community 69 - "Community 69"
Cohesion: 0.67
Nodes (2): classifyIntent(), HealthMonitorWidget()

### Community 70 - "Community 70"
Cohesion: 0.83
Nodes (2): NavIcon(), toPascal()

### Community 71 - "Community 71"
Cohesion: 0.67
Nodes (2): hash(), initials()

### Community 74 - "Community 74"
Cohesion: 0.83
Nodes (3): consoleTelemetrySink(), httpBatchTelemetrySink(), installTelemetrySink()

### Community 77 - "Community 77"
Cohesion: 0.83
Nodes (3): createPlatformEditorConfig(), createPlatformEditorExtensions(), usePlatformEditor()

### Community 78 - "Community 78"
Cohesion: 1.0
Nodes (2): isSecretKey(), scrubConfig()

### Community 79 - "Community 79"
Cohesion: 1.0
Nodes (2): CronBuilder(), describe()

### Community 80 - "Community 80"
Cohesion: 0.67
Nodes (1): SpacerWidget()

### Community 83 - "Community 83"
Cohesion: 0.67
Nodes (1): defineErpResourceMetadata()

### Community 84 - "Community 84"
Cohesion: 0.67
Nodes (1): fieldServiceEvents()

### Community 85 - "Community 85"
Cohesion: 1.0
Nodes (2): mockKpis(), mockSeries()

### Community 87 - "Community 87"
Cohesion: 0.67
Nodes (1): activate()

### Community 88 - "Community 88"
Cohesion: 0.67
Nodes (1): bookingEvents()

### Community 90 - "Community 90"
Cohesion: 0.67
Nodes (1): cn()

### Community 96 - "Community 96"
Cohesion: 1.0
Nodes (2): execute(), run()

## Knowledge Gaps
- **3 isolated node(s):** `GoogleAuthError`, `MicrosoftAuthError`, `AiQuotaError`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 22`** (103 nodes): `createGeneratedProviderAdapter()`, `createProviderAdapter()`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (101 nodes): `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mapProviderStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (26 nodes): `BusinessAdminPage()`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (26 nodes): `seedState()`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (7 nodes): `PluginBoundary.js`, `PluginBoundary.tsx`, `DefaultFallback()`, `PluginBoundary`, `.componentDidCatch()`, `.getDerivedStateFromError()`, `.render()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (7 nodes): `App.js`, `App.tsx`, `App()`, `App.tsx`, `App.tsx`, `App.tsx`, `App.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (6 nodes): `ApprovalPanel.js`, `ApprovalPanel.tsx`, `ApprovalPanel()`, `handleApprove()`, `handleReject()`, `intent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (6 nodes): `coercers.test.ts`, `asAttachment()`, `asPoint()`, `asSeries()`, `normalizeColor()`, `toArray()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (6 nodes): `package.test.ts`, `package.test.ts`, `createFrameworkSourceFixture()`, `createIo()`, `createSplitWorkspaceFixture()`, `hasDirectorySymlinkSupport()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (5 nodes): `EditorErrorBoundary.js`, `EditorErrorBoundary`, `.componentDidCatch()`, `.getDerivedStateFromError()`, `.render()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (5 nodes): `community-pages.tsx`, `action()`, `on()`, `post()`, `setPosts()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (4 nodes): `HealthMonitorWidget.js`, `HealthMonitorWidget.tsx`, `classifyIntent()`, `HealthMonitorWidget()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (4 nodes): `NavIcon.js`, `NavIcon.tsx`, `NavIcon()`, `toPascal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (4 nodes): `Avatar.js`, `Avatar.tsx`, `hash()`, `initials()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (3 nodes): `storage.ts`, `isSecretKey()`, `scrubConfig()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (3 nodes): `CronBuilder.tsx`, `CronBuilder()`, `describe()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (3 nodes): `SpacerWidget.js`, `SpacerWidget.tsx`, `SpacerWidget()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (3 nodes): `erp-metadata.js`, `erp-metadata.ts`, `defineErpResourceMetadata()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (3 nodes): `field-service-pages.js`, `field-service-pages.tsx`, `fieldServiceEvents()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (3 nodes): `hr-payroll-archetype.tsx`, `mockKpis()`, `mockSeries()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (3 nodes): `plugin.tsx`, `plugin.tsx`, `activate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (3 nodes): `BookingCalendarPage.js`, `BookingCalendarPage.tsx`, `bookingEvents()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (3 nodes): `cn.js`, `cn.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (3 nodes): `BulkActionBar.tsx`, `execute()`, `run()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `String()` connect `Community 10` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 11`, `Community 12`, `Community 13`, `Community 15`, `Community 18`, `Community 19`, `Community 20`, `Community 22`, `Community 24`, `Community 25`, `Community 27`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 36`, `Community 37`, `Community 38`, `Community 47`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `replace()` connect `Community 3` to `Community 0`, `Community 1`, `Community 2`, `Community 4`, `Community 5`, `Community 6`, `Community 8`, `Community 9`, `Community 10`, `Community 11`, `Community 12`, `Community 13`, `Community 15`, `Community 17`, `Community 20`, `Community 24`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 35`, `Community 36`, `Community 37`, `Community 38`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `parse()` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 8`, `Community 10`, `Community 11`, `Community 13`, `Community 15`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 22`, `Community 24`, `Community 27`, `Community 29`, `Community 30`, `Community 31`, `Community 33`, `Community 36`, `Community 44`, `Community 47`, `Community 59`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 222 inferred relationships involving `parse()` (e.g. with `readGutuPlugins()` and `migrate()`) actually correct?**
  _`parse()` has 222 INFERRED edges - model-reasoned connections that need verification._
- **Are the 261 inferred relationships involving `String()` (e.g. with `setup()` and `code()`) actually correct?**
  _`String()` has 261 INFERRED edges - model-reasoned connections that need verification._
- **Are the 205 inferred relationships involving `replace()` (e.g. with `personEmail()` and `personEmail()`) actually correct?**
  _`replace()` has 205 INFERRED edges - model-reasoned connections that need verification._
- **Are the 154 inferred relationships involving `nowIso()` (e.g. with `resolveAuthUser()` and `seedUsers()`) actually correct?**
  _`nowIso()` has 154 INFERRED edges - model-reasoned connections that need verification._