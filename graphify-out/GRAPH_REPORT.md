# Graph Report - Framework  (2026-04-23)

## Corpus Check
- 2771 files · ~5,577,245 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4611 nodes · 4598 edges · 45 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 484 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 74|Community 74]]

## God Nodes (most connected - your core abstractions)
1. `normalizePrefix()` - 145 edges
2. `parse()` - 114 edges
3. `parseWebhookEvent()` - 102 edges
4. `normalizeActionInput()` - 101 edges
5. `verifyWebhookSignature()` - 101 edges
6. `createProviderAdapter()` - 101 edges
7. `mapProviderStatus()` - 100 edges
8. `normalizeIdentifier()` - 92 edges
9. `countBadges()` - 57 edges
10. `requireFile()` - 57 edges

## Surprising Connections (you probably didn't know these)
- `getWorkflowTransition()` --calls--> `transitionWorkflowInstance()`  [INFERRED]
  gutu-core/framework/core/jobs/src/index.ts → plugins/gutu-plugin-workflow-core/framework/builtin-plugins/workflow-core/src/services/main.service.ts
- `parse()` --calls--> `chunkMatchesPolicy()`  [INFERRED]
  plugins/gutu-plugin-e-invoicing-core/scripts/docs-summary.mjs → libraries/gutu-lib-ai-memory/framework/libraries/ai-memory/src/index.ts
- `parse()` --calls--> `createFormDefaults()`  [INFERRED]
  plugins/gutu-plugin-e-invoicing-core/scripts/docs-summary.mjs → libraries/gutu-lib-ui-form/framework/libraries/ui-form/src/index.ts
- `write()` --calls--> `runCli()`  [INFERRED]
  tooling/business-os/scaffold.mjs → gutu-core/framework/core/cli/src/index.ts
- `write()` --calls--> `writeStream()`  [INFERRED]
  tooling/business-os/scaffold.mjs → libraries/gutu-lib-ai-mcp/framework/libraries/ai-mcp/src/index.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (124): exists(), findAdminPluginRoots(), walk(), countBadges(), parse(), assertRepositoryBoundary(), calculateNextRunAt(), canUseFrameworkSymlink() (+116 more)

### Community 1 - "Community 1"
Cohesion: 0.03
Nodes (117): ActiveRunsWidget(), AutomationInboxPage(), acknowledgeRunnerHandoff(), AgentBudgetExceededError, AgentReplayMismatchError, AgentToolDeniedError, appendAgentStep(), approveCheckpoint() (+109 more)

### Community 2 - "Community 2"
Cohesion: 0.02
Nodes (132): buildAccountingCoreMigrationSql(), buildAccountingCoreRollbackSql(), buildAiAssistCoreMigrationSql(), buildAiAssistCoreRollbackSql(), buildAnalyticsBiCoreMigrationSql(), buildAnalyticsBiCoreRollbackSql(), buildAssetsCoreMigrationSql(), buildAssetsCoreRollbackSql() (+124 more)

### Community 3 - "Community 3"
Cohesion: 0.03
Nodes (128): AgentBuilderPage(), IntegrationBuilderPage(), IssueBuilderPage(), assertBuilderRevision(), createBuilderPanelLayout(), createBuilderPublishContract(), AiSkillsAdminPage(), ExecutionWorkspacesAdminPage() (+120 more)

### Community 4 - "Community 4"
Cohesion: 0.03
Nodes (119): buildAccountingCoreSqliteMigrationSql(), buildAccountingCoreSqliteRollbackSql(), buildAiAssistCoreSqliteMigrationSql(), buildAiAssistCoreSqliteRollbackSql(), buildAnalyticsBiCoreSqliteMigrationSql(), buildAnalyticsBiCoreSqliteRollbackSql(), buildAssetsCoreSqliteMigrationSql(), buildAssetsCoreSqliteRollbackSql() (+111 more)

### Community 5 - "Community 5"
Cohesion: 0.04
Nodes (116): checkCatalog(), checkPluginDocs(), main(), missingHeadings(), placeholderFailures(), buildImportList(), capitalize(), createDocsCheckScript() (+108 more)

### Community 6 - "Community 6"
Cohesion: 0.03
Nodes (81): applyPackInstall(), buildGenericBusinessDomainPostgresMigrationSql(), buildGenericBusinessDomainSqliteMigrationSql(), cloneBusinessDeadLetterRecord(), cloneBusinessInboxItem(), cloneBusinessOutboxMessage(), cloneBusinessPluginState(), cloneBusinessProjectionRecord() (+73 more)

### Community 7 - "Community 7"
Cohesion: 0.02
Nodes (2): createGeneratedProviderAdapter(), createProviderAdapter()

### Community 8 - "Community 8"
Cohesion: 0.04
Nodes (2): parseWebhookEvent(), verifyWebhookSignature()

### Community 9 - "Community 9"
Cohesion: 0.02
Nodes (1): mapProviderStatus()

### Community 10 - "Community 10"
Cohesion: 0.05
Nodes (74): main(), read_cell_value(), read_shared_strings(), main(), runScenario(), main(), renderActions(), renderAdminContributions() (+66 more)

### Community 11 - "Community 11"
Cohesion: 0.04
Nodes (52): canLaunchZone(), canUseBuilder(), canViewPage(), canViewReport(), createAdminRegistry(), buildCartesianChartOption(), ChartSurface(), countChartSeries() (+44 more)

### Community 12 - "Community 12"
Cohesion: 0.1
Nodes (3): checkPlaceholders(), requireFile(), requireHeadings()

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (49): createPaymentIdempotencyKey(), metricCard(), PaymentsOverviewAdminPage(), PaymentsProvidersAdminPage(), PaymentsRecordsAdminPage(), PaymentsRefundsAdminPage(), PaymentsWebhooksAdminPage(), renderMetricGrid() (+41 more)

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (43): assertMemoryAccess(), buildPostgresTsQuery(), buildRetrievalPlan(), chunkMatchesPolicy(), chunkMemoryDocument(), collectionMatchesPolicy(), createSearchResultPage(), defineMemoryCollection() (+35 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (39): AiProviderError, convertZodSchema(), createErrorResponse(), createMcpRuntimeOrchestrator(), createMcpRuntimeServer(), createMcpServerFromContracts(), createSchemaCacheEntry(), createSuccessResponse() (+31 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (46): actionRequiredExample(), buildProviderRecord(), classifySupportLevel(), countSeriousImplementedOperations(), createFirstWaveReadinessReport(), createSupportMatrix(), deriveAdvertisedCapabilities(), deriveClientRuntimeRequirements() (+38 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (28): main(), renderMarkdownReport(), tailLines(), writeReports(), buildAdvanceInput(), buildCreateInput(), buildReconcileInput(), loadPluginModule() (+20 more)

### Community 18 - "Community 18"
Cohesion: 0.11
Nodes (33): compileDraft(), compileEmailDraft(), createCommunicationIdempotencyKey(), createLocalCommunicationProviderRegistry(), createRetryDecision(), defineCommunicationRoute(), defineInAppCompiler(), definePushCompiler() (+25 more)

### Community 19 - "Community 19"
Cohesion: 0.1
Nodes (31): checkRegressionGate(), compareEvalRuns(), createEvalBaseline(), roundMetric(), runEvalDataset(), AiEvalsAdminPage(), buildEvalRunId(), captureEvalBaseline() (+23 more)

### Community 20 - "Community 20"
Cohesion: 0.1
Nodes (30): adaptLegacyUiRegistry(), humanizeSlug(), inferGroupId(), inferPageKind(), inferWorkspaceId(), lastStaticAdminSegment(), toStableId(), createRegistry() (+22 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (21): buildRestrictedPreviewScenario(), buildWorkbenchHref(), createShellHarnessRegistry(), createWorkbenchCustomization(), featureLinksForProfile(), parseCookie(), resolveProfile(), resolveWorkbenchDensity() (+13 more)

### Community 22 - "Community 22"
Cohesion: 0.15
Nodes (32): assertAuditHealthy(), assertCertificationHealthy(), assertConsumerSmokeHealthy(), copyCoreRoot(), copyRepoRoots(), createAuditReport(), createFileLockEntry(), discoverCorePackageIds() (+24 more)

### Community 23 - "Community 23"
Cohesion: 0.08
Nodes (6): cn(), DashboardGrid(), MetricCard(), PageSection(), BuilderCanvas(), StatusBadge()

### Community 24 - "Community 24"
Cohesion: 0.08
Nodes (1): BusinessAdminPage()

### Community 25 - "Community 25"
Cohesion: 0.08
Nodes (1): seedState()

### Community 26 - "Community 26"
Cohesion: 0.17
Nodes (18): createNavigationContract(), findMatchingZone(), isPathPrefixMatch(), listDeepLinks(), matchesRoutePattern(), matchesZone(), normalizeHref(), resolveNavigationTarget() (+10 more)

### Community 27 - "Community 27"
Cohesion: 0.18
Nodes (8): createAsyncFieldValidationAdapter(), createDetailViewFromResource(), createDirtyStateGuard(), createFormDefaults(), createFormViewFromResource(), defineDetailView(), defineFormView(), stableSerialize()

### Community 28 - "Community 28"
Cohesion: 0.15
Nodes (6): ConfigurationError, NotSupportedError, PaymentError, ProviderError, TransportError, WebhookVerificationError

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (2): createShellQueryScope(), invalidateShellDeskQueries()

### Community 30 - "Community 30"
Cohesion: 0.56
Nodes (7): assertCatalogArtifactPolicy(), assertCatalogShape(), assertChannelShape(), assertPluginPresentationMetadata(), assertRemoteAsset(), assertSignedArtifact(), assertSortedAndUnique()

### Community 31 - "Community 31"
Cohesion: 0.43
Nodes (7): createPlatformTableOptions(), createPlatformTableState(), setPlatformColumnVisibility(), setPlatformFilter(), setPlatformSorting(), togglePlatformRowSelection(), usePlatformTable()

### Community 32 - "Community 32"
Cohesion: 0.5
Nodes (6): normalizeWebhookStatus(), parseGenericWebhookEvent(), readRecordField(), readStatusField(), readStringField(), safeJsonParse()

### Community 33 - "Community 33"
Cohesion: 0.32
Nodes (4): buildRouteHref(), createAdminRouteTaxonomy(), createDeepLink(), defineRoute()

### Community 34 - "Community 34"
Cohesion: 0.32
Nodes (3): assertCoordinates(), calculateBoundingBox(), haversineDistanceKm()

### Community 35 - "Community 35"
Cohesion: 0.52
Nodes (6): globRoots(), listStandaloneRoots(), listTrackedOffenders(), listVisibleStandaloneStatus(), runGit(), safeList()

### Community 38 - "Community 38"
Cohesion: 0.43
Nodes (5): filterCommandPaletteItems(), groupCommandPaletteItems(), normalizeQuery(), PlatformCommandPalette(), rankCommandPaletteItems()

### Community 39 - "Community 39"
Cohesion: 0.4
Nodes (2): createSplitWorkspaceFixture(), hasDirectorySymlinkSupport()

### Community 40 - "Community 40"
Cohesion: 0.6
Nodes (5): AdminShell(), getReactRuntime(), PortalShell(), ShellFrame(), SiteShell()

### Community 41 - "Community 41"
Cohesion: 0.47
Nodes (4): createAdminEditorPreset(), createReadOnlyEditorPreset(), ReadOnlyEditorRenderer(), renderReadOnlyEditorContent()

### Community 42 - "Community 42"
Cohesion: 0.5
Nodes (2): renderEmailPreview(), renderEmailTemplate()

### Community 44 - "Community 44"
Cohesion: 0.6
Nodes (3): addMoney(), sameCurrency(), subtractMoney()

### Community 45 - "Community 45"
Cohesion: 0.4
Nodes (1): App()

### Community 46 - "Community 46"
Cohesion: 0.83
Nodes (3): discoverChildren(), discoverTargets(), main()

### Community 74 - "Community 74"
Cohesion: 0.83
Nodes (3): createPlatformEditorConfig(), createPlatformEditorExtensions(), usePlatformEditor()

## Knowledge Gaps
- **Thin community `Community 7`** (103 nodes): `createGeneratedProviderAdapter()`, `createProviderAdapter()`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`, `adapter.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (102 nodes): `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `webhooks.ts`, `parseWebhookEvent()`, `verifyWebhookSignature()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (101 nodes): `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mappers.ts`, `mapProviderStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (26 nodes): `BusinessAdminPage()`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`, `main.page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (26 nodes): `seedState()`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`, `main.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (10 nodes): `createPlatformQueryClient()`, `createPlatformQueryKey()`, `createShellQueryScope()`, `invalidatePlatformScopes()`, `invalidateShellDeskQueries()`, `primePlatformQuery()`, `resetTenantScopedQueries()`, `usePlatformMutation()`, `usePlatformQuery()`, `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (6 nodes): `package.test.ts`, `package.test.ts`, `createFrameworkSourceFixture()`, `createIo()`, `createSplitWorkspaceFixture()`, `hasDirectorySymlinkSupport()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (5 nodes): `createEmailTemplateRegistry()`, `defineEmailTemplate()`, `renderEmailPreview()`, `renderEmailTemplate()`, `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (5 nodes): `App()`, `App.tsx`, `App.tsx`, `App.tsx`, `App.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `parse()` connect `Community 0` to `Community 32`, `Community 1`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 11`, `Community 13`, `Community 14`, `Community 15`, `Community 16`, `Community 22`, `Community 27`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `normalizeActionInput()` connect `Community 1` to `Community 0`, `Community 3`, `Community 6`, `Community 13`, `Community 14`, `Community 15`, `Community 19`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 57 inferred relationships involving `parse()` (e.g. with `readJson()` and `updateRootPackageJson()`) actually correct?**
  _`parse()` has 57 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `parseWebhookEvent()` (e.g. with `ingestWebhookEvent()` and `parseGenericWebhookEvent()`) actually correct?**
  _`parseWebhookEvent()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 99 inferred relationships involving `normalizeActionInput()` (e.g. with `parse()` and `publishBusinessMessage()`) actually correct?**
  _`normalizeActionInput()` has 99 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.03 - nodes in this community are weakly interconnected._