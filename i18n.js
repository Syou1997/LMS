(() => {
    const entries = {
        chooseLanguageTitle: ["選擇介面語言", "表示言語を選択", "Choose a language"],
        chooseLanguageHelp: ["請先選擇使用語言，後續的新手設定會立即切換。", "使用する言語を選択してください。以降の初期設定にすぐ反映されます。", "Choose your language first. The rest of setup will update immediately."],
        interfaceLanguage: ["介面語言", "表示言語", "Interface language"],
        weekdaySunShort: ["日", "日", "Sun"],
        weekdayMonShort: ["一", "月", "Mon"],
        weekdayTueShort: ["二", "火", "Tue"],
        weekdayWedShort: ["三", "水", "Wed"],
        weekdayThuShort: ["四", "木", "Thu"],
        weekdayFriShort: ["五", "金", "Fri"],
        weekdaySatShort: ["六", "土", "Sat"],
        timeRangeCurrent: ["時間範圍（目前使用：", "時間帯（現在：", "Time range (current: "],
        firstSetup: ["首次設定", "初期設定", "First-time setup"],
        nextStep: ["下一步", "次へ", "Next"],
        createCalendarTitle: ["建立你的排課日曆", "レッスン予定表を作成", "Create your lesson calendar"],
        localDataHelp: ["資料只會儲存在這台裝置。之後仍可在設定中修改預設模式。", "データはこの端末にのみ保存されます。既定のモードは後から設定で変更できます。", "Data is stored only on this device. You can change the default mode later in Settings."],
        userName: ["使用者名稱", "ユーザー名", "User name"],
        enterDisplayName: ["請先輸入顯示名稱。", "表示名を入力してください。", "Enter a display name first."],
        keepOnePlatform: ["請至少新增一個上課平台。", "レッスンプラットフォームを1つ以上追加してください。", "Add at least one lesson platform."],
        keepOneCategory: ["請至少新增一個分類。", "カテゴリーを1つ以上追加してください。", "Add at least one category."],
        "教師行程管理系統": ["教師行程管理系統", "講師スケジュール管理", "Teacher Schedule Manager"],
        "教師上課管理系統": ["教師上課管理系統", "講師レッスン管理", "Teacher Lesson Manager"],
        "綜合檢視": ["綜合檢視", "総合表示", "Combined view"],
        "G 匯出本月": ["G 匯出本月", "G 今月を出力", "G Export month"],
        "▣ 匯出課表圖片": ["▣ 匯出課表圖片", "▣ 予定表画像を出力", "▣ Export schedule image"],
        "公開頁資料": ["公開頁資料", "公開ページ用データ", "Public page data"],
        "↓ 備份": ["↓ 備份", "↓ バックアップ", "↓ Backup"],
        "↑ 匯入": ["↑ 匯入", "↑ インポート", "↑ Import"],
        "⚙ 設定": ["⚙ 設定", "⚙ 設定", "⚙ Settings"],
        "顯示細節": ["顯示細節", "詳細を表示", "Show details"],
        "回今天": ["回今天", "今日へ", "Today"],
        "教師排課模式": ["教師排課模式", "講師レッスンモード", "Teacher mode"],
        "一般行事曆模式": ["一般行事曆模式", "一般予定モード", "Personal mode"],
        "綜合日曆": ["綜合日曆", "総合カレンダー", "Combined calendar"],
        "教師排課": ["教師排課", "レッスン", "Lessons"],
        "一般行程": ["一般行程", "一般予定", "Personal"],
        "週日": ["週日", "日曜日", "Sun"],
        "週一": ["週一", "月曜日", "Mon"],
        "週二": ["週二", "火曜日", "Tue"],
        "週三": ["週三", "水曜日", "Wed"],
        "週四": ["週四", "木曜日", "Thu"],
        "週五": ["週五", "金曜日", "Fri"],
        "週六": ["週六", "土曜日", "Sat"],
        "本月課程": ["本月課程", "今月のレッスン", "Lessons this month"],
        "本月時數": ["本月時數", "今月の時間", "Hours this month"],
        "小時": ["小時", "時間", "hours"],
        "今日": ["今日", "今日", "Today"],
        "待辦": ["待辦", "予定", "tasks"],
        "本月完成率": ["本月完成率", "今月の達成率", "Monthly completion"],
        "預計總收入": ["預計總收入", "収入見込み", "Estimated income"],
        "此模式僅供檢視。": ["此模式僅供檢視。", "このモードは閲覧専用です。", "This mode is view-only."],
        "復原": ["復原", "元に戻す", "Undo"],
        "開始設定你的行程工具": ["開始設定你的行程工具", "スケジュールツールを設定", "Set up your schedule tool"],
        "請先選擇主要用途。之後也可以從設定切換模式，不會刪除既有資料。": ["請先選擇主要用途。之後也可以從設定切換模式，不會刪除既有資料。", "主な用途を選択してください。モードは後から変更でき、既存データは削除されません。", "Choose your main use. You can switch modes later without deleting existing data."],
        "適合線上老師、家教、補習班老師管理課程、學生、平台與收入。": ["適合線上老師、家教、補習班老師管理課程、學生、平台與收入。", "オンライン講師、家庭教師、塾講師のレッスン・生徒・収入管理に適しています。", "For online teachers, tutors, and instructors managing lessons, students, platforms, and income."],
        "適合個人行程、花費紀錄、工作安排與生活待辦。": ["適合個人行程、花費紀錄、工作安排與生活待辦。", "個人の予定、支出、仕事、日常のタスク管理に適しています。", "For personal schedules, expenses, work, and everyday tasks."],
        "顯示名稱": ["顯示名稱", "表示名", "Display name"],
        "例如：Syou": ["例如：Syou", "例：Syou", "Example: Syou"],
        "匯出圖片時顯示詳細資訊": ["匯出圖片時顯示詳細資訊", "画像出力時に詳細を表示", "Show details in exported images"],
        "設定時區": ["設定時區", "タイムゾーン", "Time zone"],
        "你可以使用預設時區，也可以自行新增國家／地點與 GMT 時差。": ["你可以使用預設時區，也可以自行新增國家／地點與 GMT 時差。", "既定のタイムゾーンを使用するか、地域と GMT 時差を追加できます。", "Use a preset time zone or add a location and GMT offset."],
        "主要時區": ["主要時區", "基準タイムゾーン", "Base time zone"],
        "顯示時區": ["顯示時區", "表示タイムゾーン", "Display time zone"],
        "新增自訂時區": ["新增自訂時區", "カスタムタイムゾーンを追加", "Add custom time zone"],
        "國家或地點，例如：韓國": ["國家或地點，例如：韓國", "国・地域（例：韓国）", "Country or place, e.g. Korea"],
        "新增": ["新增", "追加", "Add"],
        "設定上課平台": ["設定上課平台", "レッスンプラットフォームを設定", "Set lesson platforms"],
        "前 10 個平台可以有不同顏色，第 11 個開始會統一灰色。": ["前 10 個平台可以有不同顏色，第 11 個開始會統一灰色。", "最初の10件は色分けでき、11件目以降は灰色になります。", "The first 10 platforms can have unique colors; later ones use gray."],
        "準備完成": ["準備完成", "設定完了", "Ready"],
        "確認後就可以開始使用。之後也能從右上角「設定」修改。": ["確認後就可以開始使用。之後也能從右上角「設定」修改。", "確認後すぐに使えます。後から設定で変更できます。", "Confirm to start. You can change these options later in Settings."],
        "上一步": ["上一步", "戻る", "Back"],
        "開始使用": ["開始使用", "利用開始", "Start"],
        "設定": ["設定", "設定", "Settings"],
        "使用模式": ["使用模式", "使用モード", "Mode"],
        "主要時區是新增與儲存行程的基準。顯示時區和上方選單僅切換畫面顯示時間。": ["主要時區是新增與儲存行程的基準。顯示時區和上方選單僅切換畫面顯示時間。", "基準タイムゾーンは予定の保存基準です。表示タイムゾーンと上部の選択欄は画面表示のみを切り替えます。", "The base time zone is used to save events. The display time zone and header selector only change how times appear."],
        "幣別": ["幣別", "通貨", "Currency"],
        "預設時間長度（分鐘）": ["預設時間長度（分鐘）", "既定の時間（分）", "Default duration (minutes)"],
        "上課平台與顏色": ["上課平台與顏色", "プラットフォームと色", "Platforms and colors"],
        "平台或分類不能有相同名稱。": ["平台或分類不能有相同名稱。", "プラットフォームやカテゴリーに同じ名前は使えません。", "Platform and category names must be unique."],
        "修改既有名稱後，先前建立的課程或行程也會自動套用新名稱。": ["修改既有名稱後，先前建立的課程或行程也會自動套用新名稱。", "既存名を変更すると、以前のレッスンや予定にも新しい名前が反映されます。", "Renaming an existing item also updates earlier lessons and events."],
        "初始化": ["初始化", "初期化", "Reset"],
        "儲存設定": ["儲存設定", "設定を保存", "Save settings"],
        "取消": ["取消", "キャンセル", "Cancel"],
        "選填": ["選填", "任意", "Optional"],
        "搜尋學生、平台或課程內容": ["搜尋學生、平台或課程內容", "生徒・プラットフォーム・内容を検索", "Search students, platforms, or lesson details"],
        "搜尋學生、平台、分類或內容": ["搜尋學生、平台、分類或內容", "生徒・プラットフォーム・カテゴリー・内容を検索", "Search students, platforms, categories, or details"],
        "新增排課": ["新增排課", "レッスンを追加", "Add lesson"],
        "新增行程": ["新增行程", "予定を追加", "Add event"],
        "上課平台": ["上課平台", "レッスンプラットフォーム", "Lesson platform"],
        "自訂平台": ["自訂平台", "プラットフォームを入力", "Custom platform"],
        "自訂": ["自訂", "手動入力", "Custom"],
        "費用": ["費用", "料金", "Fee"],
        "學生姓名（選填）": ["學生姓名（選填）", "生徒名（任意）", "Student name (optional)"],
        "學生姓名": ["學生姓名", "生徒名", "Student name"],
        "請輸入姓名": ["請輸入姓名", "名前を入力", "Enter a name"],
        "分類（選填）": ["分類（選填）", "カテゴリー（任意）", "Category (optional)"],
        "分類": ["分類", "カテゴリー", "Category"],
        "自訂分類": ["自訂分類", "カテゴリーを入力", "Custom category"],
        "對象（選填）": ["對象（選填）", "相手（任意）", "Person (optional)"],
        "地點（選填）": ["地點（選填）", "場所（任意）", "Location (optional)"],
        "地點": ["地點", "場所", "Location"],
        "花費明細（選填）": ["花費明細（選填）", "支出明細（任意）", "Expense details (optional)"],
        "＋ 新增花費項目": ["＋ 新增花費項目", "＋ 支出を追加", "＋ Add expense"],
        "時間範圍": ["時間範圍", "時間帯", "Time range"],
        "未設定": ["未設定", "未設定", "Not set"],
        "時間未定": ["時間未定", "時間未定", "Time not set"],
        "今天": ["今天", "今日", "Today"],
        "無符合結果": ["無符合結果", "一致する結果はありません", "No matching results"],
        "已完成": ["已完成", "完了", "Completed"],
        "開始時間": ["開始時間", "開始時刻", "Start time"],
        "結束時間": ["結束時間", "終了時刻", "End time"],
        "一般模式可不填時間；若填寫時間，會檢查是否與既有行程衝突。": ["一般模式可不填時間；若填寫時間，會檢查是否與既有行程衝突。", "一般予定は時刻未設定でも保存できます。時刻を設定すると重複を確認します。", "Personal events can be saved without times. When times are set, conflicts are checked."],
        "重複": ["重複", "繰り返し", "Repeat"],
        "排課": ["排課", "レッスン", "lesson"],
        "重複設定": ["重複設定", "繰り返し設定", "Repeat"],
        "不重複": ["不重複", "繰り返さない", "Does not repeat"],
        "自訂重複日期": ["自訂重複日期", "日付を選択", "Choose repeat dates"],
        "每天重複到本週日": ["每天重複到本週日", "今週の日曜日まで毎日", "Daily through Sunday"],
        "每週重複 4 次": ["每週重複 4 次", "毎週4回", "Weekly, 4 times"],
        "每週重複 8 次": ["每週重複 8 次", "毎週8回", "Weekly, 8 times"],
        "每週重複到本月底": ["每週重複到本月底", "月末まで毎週", "Weekly through month end"],
        "每天重複到本月底（不含六日）": ["每天重複到本月底（不含六日）", "月末まで平日のみ毎日", "Every weekday through month end"],
        "編輯既有項目時不會套用重複設定。": ["編輯既有項目時不會套用重複設定。", "既存項目の編集には繰り返し設定は適用されません。", "Repeat settings are not applied when editing an existing item."],
        "課程內容": ["課程內容", "レッスン内容", "Lesson details"],
        "行程內容": ["行程內容", "予定内容", "Event details"],
        "備註（選填）": ["備註（選填）", "メモ（任意）", "Notes (optional)"],
        "備註": ["備註", "メモ", "Notes"],
        "補充事項、注意事項或提醒...": ["補充事項、注意事項或提醒...", "補足・注意事項・リマインダー...", "Additional notes, cautions, or reminders..."],
        "請輸入教材或進度...": ["請輸入教材或進度...", "教材や進捗を入力...", "Enter materials or progress..."],
        "確認儲存": ["確認儲存", "保存", "Save"],
        "儲存": ["儲存", "保存", "Save"],
        "選擇自訂重複日期": ["選擇自訂重複日期", "繰り返す日付を選択", "Choose repeat dates"],
        "選擇重複日期": ["選擇重複日期", "繰り返す日付を選択", "Choose repeat dates"],
        "確定": ["確定", "決定", "Confirm"],
        "刪除": ["刪除", "削除", "Delete"],
        "編輯": ["編輯", "編集", "Edit"],
        "複製": ["複製", "コピー", "Copy"],
        "課程": ["課程", "レッスン", "Lesson"],
        "行程": ["行程", "予定", "Event"],
        "保留": ["保留", "残す", "Keep"],
        "課表圖片預覽": ["課表圖片預覽", "予定表画像プレビュー", "Schedule image preview"],
        "↓ 下載圖片": ["↓ 下載圖片", "↓ 画像を保存", "↓ Download image"],
        "我的排課日曆": ["我的排課日曆", "わたしのレッスン予定表", "My Lesson Calendar"],
        "Home": ["Home", "ホーム", "Home"],
        "請選擇新的日期": ["請選擇新的日期", "移動先の日付を選択", "Choose a new date"],
        "本日課程": ["本日課程", "本日のレッスン", "Today's lessons"],
        "刪除本日": ["刪除本日", "本日を削除", "Delete day"],
        "快速尋找": ["快速尋找", "クイック検索", "Quick find"],
        "搜尋行程": ["搜尋行程", "予定を検索", "Search events"],
        "本月概況": ["本月概況", "今月の概要", "Monthly overview"],
        "近期行程": ["近期行程", "今後の予定", "Upcoming events"],
        "個人化與資料": ["個人化與資料", "個人設定とデータ", "Preferences and data"],
        "預設開啟模式": ["預設開啟模式", "起動時のモード", "Default mode"],
        "切換時區後，所有行程時間會自動換算。": ["切換時區後，所有行程時間會自動換算。", "タイムゾーンを変更すると、すべての予定時刻が自動変換されます。", "Changing the time zone automatically converts all event times."],
        "隱藏匯出圖片資訊": ["隱藏匯出圖片資訊", "画像出力時に詳細を隠す", "Hide details in exported images"],
        "自訂時區": ["自訂時區", "カスタムタイムゾーン", "Custom time zones"],
        "新增平台": ["新增平台", "プラットフォームを追加", "Add platform"],
        "新增類別": ["新增類別", "カテゴリーを追加", "Add category"],
        "資料備份": ["資料備份", "データのバックアップ", "Data backup"],
        "分享備份檔到雲端硬碟或自己的其他裝置。換手機或刪除 App 前，建議先備份。新手機可使用匯入功能還原資料。": ["分享備份檔到雲端硬碟或自己的其他裝置。換手機或刪除 App 前，建議先備份。新手機可使用匯入功能還原資料。", "バックアップをクラウドや別の端末へ共有できます。機種変更や App の削除前に保存し、新しい端末で復元してください。", "Share a backup to cloud storage or another device. Back up before changing phones or deleting the app, then restore it on the new device."],
        "分享備份檔": ["分享備份檔", "バックアップを共有", "Share backup"],
        "匯入備份檔": ["匯入備份檔", "バックアップを復元", "Import backup"],
        "初始化 App": ["初始化 App", "App を初期化", "Reset app"],
        "清除這台裝置上的設定與全部行程。": ["清除這台裝置上的設定與全部行程。", "この端末の設定とすべての予定を削除します。", "Delete all settings and events on this device."],
        "匯出圖片": ["匯出圖片", "画像を出力", "Export image"],
        "月曆": ["月曆", "カレンダー", "Calendar"],
        "搜尋": ["搜尋", "検索", "Search"],
        "統計": ["統計", "統計", "Stats"],
        "綜合日曆僅提供檢視": ["綜合日曆僅提供檢視", "総合カレンダーは閲覧専用です", "Combined calendar is view-only"],
        "日期": ["日期", "日付", "Date"],
        "花費": ["花費", "支出", "Expense"],
        "刪除此筆": ["刪除此筆", "この予定を削除", "Delete event"],
        "已依照手機時區預先選擇。切換時區後，所有行程時間會自動換算。": ["已依照手機時區預先選擇。切換時區後，所有行程時間會自動換算。", "端末のタイムゾーンを選択済みです。変更するとすべての予定時刻が自動変換されます。", "Your device time zone is preselected. Changing it converts all event times automatically."],
        "選擇年月": ["選擇年月", "年月を選択", "Choose year and month"]
    };

    const byText = new Map();
    Object.entries(entries).forEach(([key, values]) => values.forEach(value => byText.set(value, key)));
    let languageGetter = () => "zh-TW";
    const languageIndex = language => language === "ja" ? 1 : language === "en" ? 2 : 0;

    window.trText = (keyOrText, language = languageGetter()) => {
        const key = entries[keyOrText] ? keyOrText : byText.get(keyOrText);
        return key ? entries[key][languageIndex(language)] : keyOrText;
    };

    window.initializeI18n = getter => {
        languageGetter = getter;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach(node => {
            if (["SCRIPT", "STYLE"].includes(node.parentElement?.tagName)) return;
            const trimmed = node.nodeValue.trim();
            const key = byText.get(trimmed);
            if (!key) return;
            const leading = node.nodeValue.match(/^\s*/)?.[0] || "";
            const trailing = node.nodeValue.match(/\s*$/)?.[0] || "";
            const parent = node.parentElement;
            if (parent && parent.childNodes.length === 1) {
                parent.dataset.i18n = key;
                parent.dataset.i18nLeading = leading;
                parent.dataset.i18nTrailing = trailing;
            } else {
                const span = document.createElement("span");
                span.dataset.i18n = key;
                span.dataset.i18nLeading = leading;
                span.dataset.i18nTrailing = trailing;
                node.replaceWith(span);
            }
        });
        document.querySelectorAll("[placeholder], [title], [aria-label]").forEach(element => {
            ["placeholder", "title", "aria-label"].forEach(attribute => {
                const value = element.getAttribute(attribute);
                const key = byText.get(value);
                if (!key) return;
                if (attribute === "placeholder") element.dataset.i18nPlaceholder = key;
                if (attribute === "title") element.dataset.i18nTitle = key;
                if (attribute === "aria-label") element.dataset.i18nAriaLabel = key;
            });
        });
        window.applyI18n();
    };

    window.applyI18n = () => {
        const language = languageGetter();
        document.documentElement.lang = language;
        document.querySelectorAll("[data-i18n]").forEach(element => {
            element.textContent = `${element.dataset.i18nLeading || ""}${window.trText(element.dataset.i18n, language)}${element.dataset.i18nTrailing || ""}`;
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(element => element.placeholder = window.trText(element.dataset.i18nPlaceholder, language));
        document.querySelectorAll("[data-i18n-title]").forEach(element => element.title = window.trText(element.dataset.i18nTitle, language));
        document.querySelectorAll("[data-i18n-aria-label]").forEach(element => element.setAttribute("aria-label", window.trText(element.dataset.i18nAriaLabel, language)));
    };
})();
