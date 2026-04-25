# Graph Report - quirky-meninsky-fa348a  (2026-04-25)

## Corpus Check
- 544 files · ~489,717 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2329 nodes · 3728 edges · 48 communities detected
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 979 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]

## God Nodes (most connected - your core abstractions)
1. `replace()` - 81 edges
2. `scaffoldBusinessPlugin()` - 48 edges
3. `parse()` - 46 edges
4. `run()` - 43 edges
5. `useAllRecords()` - 34 edges
6. `nowIso()` - 32 edges
7. `MicrosoftDriver` - 30 edges
8. `GoogleDriver` - 27 edges
9. `seedAll()` - 26 edges
10. `scaffoldBusinessPackCatalog()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `buildBasePathMap()` --calls--> `walk()`  [INFERRED]
  admin-panel/src/examples/_factory/richDetailFactory.tsx → tooling/library-docs/lib.mjs
- `walkParts()` --calls--> `walk()`  [INFERRED]
  admin-panel/backend/src/lib/mail/driver/google.ts → tooling/library-docs/lib.mjs
- `collectBodies()` --calls--> `walk()`  [INFERRED]
  admin-panel/backend/src/lib/mail/mime/parser.ts → tooling/library-docs/lib.mjs
- `log()` --calls--> `main()`  [INFERRED]
  admin-panel/scripts/gutu-plugin.mjs → tooling/business-os/scaffold.mjs
- `cmdCreate()` --calls--> `writeFile()`  [INFERRED]
  admin-panel/scripts/gutu-plugin.mjs → tooling/plugin-docs/generate.mjs

## Communities

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (135): registerAffineEditorContainer(), runOrError(), recordAudit(), createSession(), currentUser(), deleteSession(), getSessionUser(), getUserByEmail() (+127 more)

### Community 1 - "Community 1"
Cohesion: 0.02
Nodes (110): count(), personName(), pick(), seedAssetsExtended(), seedIf(), count(), personEmail(), personName() (+102 more)

### Community 2 - "Community 2"
Cohesion: 0.01
Nodes (45): fetchAll(), fetchAll(), fetchAll(), fetchAll(), fetchAll(), fetchAll(), fetchAll(), fetchAll() (+37 more)

### Community 3 - "Community 3"
Cohesion: 0.04
Nodes (113): buildImportList(), capitalize(), createDocsCheckScript(), createSummaryScript(), createWorkspaceRunnerScript(), describeUiSurface(), ensureScripts(), hasExportName() (+105 more)

### Community 4 - "Community 4"
Cohesion: 0.03
Nodes (70): imageProxyHref(), parseVCard(), toVCard(), findColumn(), handleDragEnd(), handleDragOver(), sanitizeForHeader(), personEmail() (+62 more)

### Community 5 - "Community 5"
Cohesion: 0.03
Nodes (62): createActivationEngine(), apiBase(), createEditorRecord(), deleteEditorRecord(), fetchEditorRecord(), fetchSnapshot(), getAuthHeaders(), listEditorRecords() (+54 more)

### Community 6 - "Community 6"
Cohesion: 0.03
Nodes (66): addLeaf(), emit(), emptyLeaf(), isLeaf(), removeAt(), updateAt(), GutuAffineEditorContainer, toggleAll() (+58 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (38): send(), decodeKeyMaterial(), decryptBytes(), decryptString(), encryptBytes(), encryptString(), findKey(), getPrimaryKeyVersion() (+30 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (75): buildDependencyContractsFromLists(), dedupeList(), deriveSuggestedPackIds(), main(), renderActions(), renderAdminContributions(), renderAdminPage(), renderBusinessPackAutomation() (+67 more)

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (53): handleApply(), checkCatalog(), checkPluginDocs(), main(), missingHeadings(), placeholderFailures(), handler(), cmdCreate() (+45 more)

### Community 10 - "Community 10"
Cohesion: 0.04
Nodes (29): AdminInner(), AppShell(), useLiveAudit(), useRuntime(), detailViewFromZod(), if(), RichZodDetailPage(), formViewFromZod() (+21 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (26): decodeEncodedWords(), formatAddress(), isValidEmail(), normalizeSubject(), parseAddress(), parseAddressList(), splitAddressList(), stripComments() (+18 more)

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (43): bootstrapStorage(), localDefaultConfig(), parseStorageBackendsEnv(), s3DefaultFromEnv(), envEnum(), envFlag(), envInt(), loadConfig() (+35 more)

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (42): AutomationRunDetailPage(), BookingDashboardKpis(), pct(), create(), addNote(), CrmOverviewPage(), dealBadgeIntent(), useActivities() (+34 more)

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (30): buildDomainPlugin(), buildResource(), definePlugin(), isV2Plugin(), buildPluginContext(), CapabilityError, createContributionStore(), makeAnalytics() (+22 more)

### Community 15 - "Community 15"
Cohesion: 0.07
Nodes (12): AnalyticsEmitterImpl, createAnalytics(), ensureSessionId(), createRuntime(), CapabilityRegistryImpl, createCapabilityRegistry(), createFeatureFlags(), FeatureFlagStoreImpl (+4 more)

### Community 16 - "Community 16"
Cohesion: 0.11
Nodes (33): AiProviderError, AiQuotaError, cost(), recordUsage(), redactPII(), runAnthropic(), runChat(), runGroq() (+25 more)

### Community 17 - "Community 17"
Cohesion: 0.08
Nodes (4): ImapClient, ImapDriver, sendSmtp(), startRealtime()

### Community 18 - "Community 18"
Cohesion: 0.14
Nodes (19): batches(), bins(), count(), deliveryNotes(), deliveryTrips(), items(), itemSuppliers(), landedCosts() (+11 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (11): formatAddresses(), MailAvatar(), appendAlternative(), appendAttachment(), appendBodyPart(), buildMessage(), encodeHeader(), pushHeaders() (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (14): bankAccounts(), bankTransactions(), budgets(), costCenters(), count(), currencyRates(), dunning(), fiscalYears() (+6 more)

### Community 21 - "Community 21"
Cohesion: 0.19
Nodes (17): applyStructuredFilter(), bufferToFloat32(), magnitude(), runFts(), runRecent(), runVector(), search(), compileOperatorTerm() (+9 more)

### Community 22 - "Community 22"
Cohesion: 0.2
Nodes (13): cannedResponses(), count(), csatResponses(), escalations(), kbArticles(), personName(), pick(), seedIf() (+5 more)

### Community 23 - "Community 23"
Cohesion: 0.12
Nodes (9): AccessDenied, ChecksumMismatch, InvalidKey, isRetryableByDefault(), isStorageError(), ObjectNotFound, PayloadTooLarge, StorageError (+1 more)

### Community 24 - "Community 24"
Cohesion: 0.13
Nodes (5): fmt(), formatValue(), cn(), fmt(), fmt()

### Community 25 - "Community 25"
Cohesion: 0.26
Nodes (4): token(), uuid(), MockBackend, sleep()

### Community 26 - "Community 26"
Cohesion: 0.21
Nodes (3): PostgresDbx, translateJsonExtract(), translateQmarkToDollar()

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (7): cmp(), eq(), evalFilter(), evalLeaf(), getPath(), relativeRange(), toTime()

### Community 29 - "Community 29"
Cohesion: 0.31
Nodes (5): formatCurrency(), formatDate(), formatDateTime(), formatNumber(), renderCellValue()

### Community 30 - "Community 30"
Cohesion: 0.39
Nodes (6): aggregate(), bucketKey(), computeAggregation(), evalFilter(), evalLeaf(), previousRange()

### Community 31 - "Community 31"
Cohesion: 0.43
Nodes (4): buildFilterState(), buildFilterTree(), collapse(), toLeaf()

### Community 32 - "Community 32"
Cohesion: 0.57
Nodes (6): compareVersions(), expandShorthand(), parseVersion(), satisfies(), satisfiesAnd(), satisfiesComparator()

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (3): loadPersonalization(), saveEdit(), savePersonalization()

### Community 34 - "Community 34"
Cohesion: 0.52
Nodes (6): globRoots(), listStandaloneRoots(), listTrackedOffenders(), listVisibleStandaloneStatus(), runGit(), safeList()

### Community 35 - "Community 35"
Cohesion: 0.53
Nodes (5): containsLookalike(), looksLikeBrandImpersonation(), parseAuthResults(), phishHeuristics(), splitMethods()

### Community 36 - "Community 36"
Cohesion: 0.33
Nodes (3): BarChart(), niceScale(), LineChart()

### Community 37 - "Community 37"
Cohesion: 0.33
Nodes (1): PluginBoundary

### Community 39 - "Community 39"
Cohesion: 0.33
Nodes (3): ConnectionsTab(), IdentitiesTab(), useConnections()

### Community 40 - "Community 40"
Cohesion: 0.47
Nodes (3): getTheme(), setTheme(), toggleTheme()

### Community 41 - "Community 41"
Cohesion: 0.4
Nodes (1): ErrorBoundary

### Community 42 - "Community 42"
Cohesion: 0.4
Nodes (2): ThreadView(), useThread()

### Community 43 - "Community 43"
Cohesion: 0.5
Nodes (2): post(), setPosts()

### Community 44 - "Community 44"
Cohesion: 0.83
Nodes (3): parseMailto(), parseRfcUnsubscribe(), parseUnsubscribe()

### Community 46 - "Community 46"
Cohesion: 0.67
Nodes (2): attachRpcHandler(), spawnIframeSandbox()

### Community 47 - "Community 47"
Cohesion: 0.67
Nodes (2): attachWorkerRpc(), spawnWorkerSandbox()

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (2): isSecretKey(), scrubConfig()

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (2): NavIcon(), toPascal()

### Community 56 - "Community 56"
Cohesion: 0.67
Nodes (1): activate()

## Knowledge Gaps
- **4 isolated node(s):** `GoogleAuthError`, `MicrosoftAuthError`, `AiQuotaError`, `AiProviderError`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 37`** (6 nodes): `PluginBoundary.tsx`, `DefaultFallback()`, `PluginBoundary`, `.componentDidCatch()`, `.getDerivedStateFromError()`, `.render()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (5 nodes): `ErrorBoundary.tsx`, `ErrorBoundary`, `.componentDidCatch()`, `.getDerivedStateFromError()`, `.render()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (5 nodes): `ThreadView.tsx`, `use-thread.ts`, `async()`, `ThreadView()`, `useThread()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (5 nodes): `community-pages.tsx`, `action()`, `on()`, `post()`, `setPosts()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (4 nodes): `iframeSandbox.tsx`, `attachRpcHandler()`, `dispatchRpc()`, `spawnIframeSandbox()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (4 nodes): `workerSandbox.ts`, `attachWorkerRpc()`, `dispatchWorkerRpc()`, `spawnWorkerSandbox()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (3 nodes): `storage.ts`, `isSecretKey()`, `scrubConfig()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (3 nodes): `NavIcon.tsx`, `NavIcon()`, `toPascal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (3 nodes): `plugin.tsx`, `plugin.tsx`, `activate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `replace()` connect `Community 4` to `Community 1`, `Community 3`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 11`, `Community 12`, `Community 13`, `Community 14`, `Community 16`, `Community 17`, `Community 19`, `Community 21`, `Community 25`, `Community 26`, `Community 32`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **Why does `seedAll()` connect `Community 1` to `Community 0`, `Community 3`, `Community 7`, `Community 9`, `Community 18`, `Community 20`, `Community 22`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `SavedViewManager()` connect `Community 10` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Are the 79 inferred relationships involving `replace()` (e.g. with `personEmail()` and `personEmail()`) actually correct?**
  _`replace()` has 79 INFERRED edges - model-reasoned connections that need verification._
- **Are the 42 inferred relationships involving `parse()` (e.g. with `readGutuPlugins()` and `parseStorageBackendsEnv()`) actually correct?**
  _`parse()` has 42 INFERRED edges - model-reasoned connections that need verification._
- **Are the 39 inferred relationships involving `run()` (e.g. with `seedUsers()` and `updateTenant()`) actually correct?**
  _`run()` has 39 INFERRED edges - model-reasoned connections that need verification._
- **Are the 32 inferred relationships involving `useAllRecords()` (e.g. with `BookingDashboardKpis()` and `useBookingKpi()`) actually correct?**
  _`useAllRecords()` has 32 INFERRED edges - model-reasoned connections that need verification._