/**
 * @name AutoModBypass
 * @author Harry Uchiha (z_zx)
 * @authorId 333014456399560705
 * @version 1.0.0
 * @description Changes the text with Unicode to bypass AutoMod.
 * @invite W6JfvA4y66
 */

module.exports = (_ => {
	const changeLog = {
		
	};
	
	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		constructor (meta) {for (let key in meta) this[key] = meta[key];}
		getName () {return this.name;}
		getAuthor () {return this.author;}
		getVersion () {return this.version;}
		getDescription () {return `The Library Plugin needed for ${this.name} is missing. Open the Plugin Settings to download it. \n\n${this.description}`;}
		
		downloadLibrary () {
			BdApi.Net.fetch("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js").then(r => {
				if (!r || r.status != 200) throw new Error();
				else return r.text();
			}).then(b => {
				if (!b) throw new Error();
				else return require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.UI.showToast("Finished downloading BDFDB Library", {type: "success"}));
			}).catch(error => {
				BdApi.UI.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.UI.showConfirmationModal("Library Missing", `The Library Plugin needed for ${this.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(this.name)) window.BDFDB_Global.pluginQueue.push(this.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${this.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		const QuickToogleButtonComponent = class TranslateButton extends BdApi.React.Component {
			componentDidMount() {
				toggleButtons[this.props.type] = this;
			}
			componentWillUnmount() {
				delete toggleButtons[this.props.type];
			}
			render() {
				return BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.ChannelTextAreaButton, {
					className: BDFDB.DOMUtils.formatClassName(BDFDB.disCN._writeuppercasequicktogglebutton, BDFDB.disCN._writeuppercasequicktogglebuttonenabled, BDFDB.disCN.textareapickerbutton),
					iconSVG: channelBlacklist.indexOf(this.props.channelId) == -1 ? `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>` : `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="${BDFDB.DiscordConstants.ColorsCSS.STATUS_DANGER}" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>`,
					nativeClass: true,
					onClick: _ => {
						if (channelBlacklist.indexOf(this.props.channelId) > -1) BDFDB.ArrayUtils.remove(channelBlacklist, this.props.channelId, true);
						else channelBlacklist.push(this.props.channelId);
						for (let type in toggleButtons) BDFDB.ReactUtils.forceUpdate(toggleButtons[type]);
					}
				});
			}
		};
		
		const symbols = [".", "!", "¡", "?", "¿"], spaces = ["\n", "\r", "\t", " ", "  ", "   ", "    "];
		
		const channelBlacklist = [];
		const toggleButtons = {};
		
		return class WriteUpperCase extends Plugin {
			onLoad () {
				this.defaults = {
					general: {
						addQuickToggle:		{value: true, 			description: "Adds a quick Toggle to the Message Input"}
					},
					places: {
						normal:			{value: true, 			description: "Normal Message Textarea"},
						edit:			{value: true, 			description: "Edit Message Textarea"},
						form:			{value: true, 			description: "Upload Message Prompt"},
						user_profile:		{value: true, 			description: "Quick Message Textarea UserPopout"}
					}
				};
				
				this.modulePatches = {
					before: [
						"ChannelTextAreaEditor"
					],
					after: [
						"ChannelTextAreaButtons"
					]
				};
			}
			
			onStart () {
				BDFDB.PatchUtils.forceAllUpdates(this);
			}
			
			onStop () {
				BDFDB.PatchUtils.forceAllUpdates(this);
			}

			getSettingsPanel (collapseStates = {}) {
				let settingsPanel;
				return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, {
					collapseStates: collapseStates,
					children: _ => {
						let settingsItems = [];
				
						for (let key in this.defaults.general) settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
							type: "Switch",
							plugin: this,
							keys: ["general", key],
							label: this.defaults.general[key].description,
							value: this.settings.general[key]
						}));
						
						settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsPanelList, {
							title: "Automatically transform in:",
							children: Object.keys(this.defaults.places).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
								type: "Switch",
								plugin: this,
								keys: ["places", key],
								label: this.defaults.places[key].description,
								value: this.settings.places[key]
							}))
						}));
						
						return settingsItems;
					}
				});
			}

			onSettingsClosed () {
				if (this.SettingsUpdated) {
					delete this.SettingsUpdated;
					BDFDB.PatchUtils.forceAllUpdates(this);
				}
			}

			processChannelTextAreaEditor (e) {
				let type = e.instance.props.type.analyticsName || e.instance.props.type || "";
				if (e.instance.props.textValue && e.instance.props.focused && (!type || this.settings.places[type] || !this.defaults.places[type]) && (!this.settings.general.addQuickToggle || channelBlacklist.indexOf(e.instance.props.channel.id) == -1) && e.instance.props.richValue && e.instance.props.richValue[0] && !e.instance.props.richValue[0].command) {
					let string = e.instance.props.textValue;
					let newString = this.parse(string);
					if (string != newString) {
						let selection = document.getSelection();
						let container = selection.anchorNode && BDFDB.DOMUtils.getParent("[contenteditable]", selection.anchorNode.parentElement);
						if (container && Array.from(container.children).findIndex(n => n && n.contains(selection.anchorNode)) == (container.childElementCount - 1)) {
							selection.modify("extend", "backward", "paragraphboundary");
							if (selection.toString().length == selection.anchorNode.textContent.length) {
								e.instance.props.textValue = newString;
								if (e.instance.props.richValue) e.instance.props.richValue = BDFDB.SlateUtils.toRichValue(newString);
							}
							selection.collapseToEnd();
						}
					}
				}
			}
			
			processChannelTextAreaButtons (e) {
				let type = e.instance.props.type.analyticsName || e.instance.props.type || "";
				if ((!type || this.settings.places[type] || !this.defaults.places[type]) && this.settings.general.addQuickToggle && !e.instance.props.disabled) {
					e.returnvalue.props.children.unshift(BDFDB.ReactUtils.createElement(QuickToogleButtonComponent, {
						type: type,
						channelId: e.instance.props.channel.id
					}));
				}
			}
			

			parse (string) {
				const spchar = {
					"a": "а", "c": "с", "d": "ԁ", "e": "е", "i": "і",
					"j": "ј", "o": "ο", "p": "р", "q": "ԛ", "s": "ѕ",
					"w": "ԝ", "x": "х", "y": "у", "A": "Α", "B": "Β",
					"C": "С", "E": "Ε", "H": "Η", "I": "Ι", "J": "Ј",
					"K": "Κ", "M": "Μ", "N": "Ν", "O": "Ο", "P": "Ρ",
					"S": "Ѕ", "T": "Τ", "X": "Χ", "Y": "Υ", "Z": "Ζ"
				};
				
				
				function replaceChar(str) {
					return str.split("").map(c => spchar[c] ?? c).join("");
				}
				
				function replaceText(text) {
					return text.split(" ").map(replaceChar).join(" ");
				}
				 
				if("a" === "a") return replaceText(string);
			}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(changeLog));
})();
