# [prototypes][3] `2022/04/17` 

> 
* [cavalion-blocks][4]
* [App][5] - <= _#window is instantiated here (weirdly not in .desktop)_
	* [.console][5] << _hotkeys_ _probably deprecated_ 
	* [.desktop][5] << _#client [ui/forms/Portal<>][9]_ _used at all?_
	* [.framework7][5] - [.scaffold][5]
	* [.v1][5] - <= _#client [ui/forms/Portal<>][9]_ _(used by cavalion-code and veldoffice-vcl-comps)_
	* [.v2][5] - <= _Main<>_ 
		* [.glassy][5] [.openform][5] [.toast][5]
* [make][3] / [Build][7]
* [ui][9]
	* [Form][10] - [forms][9]
		* [Home][11] [.list][11] [.tree][11]
		* [Portal][9] - [View][9]
		* [util][12] / [Console][13] - << _used by cavalion-code and veldoffice-MODULE-vcl_
	* [controls][9] / [SizeHandle][15] - [Toolbar][15]
	* [dygraphs][9] / [LineChart][17] - [Timeline][17] - _deprecated?_
	* [entities][18]
		* [AttributeInput][19] 
			* [.@checkbox][19] - [.@input][19] - [.@textarea][19] - [.boolean][19] - [.date][19] - [.double][19]  
			[.int][19] - [.long][19] - [.ref][19] - [.scaffold][19] - [.set][19] - [.string][19] - [.text][19] - [.timestamp][19]
		* [Edit][20] - [.modal][20] - [.scaffold][20]
		* [Home][18]
		* [Instance][18]	
		* [ModelNavigator][18]
		* [Query][21] - [.scaffold][21] - [scaffold.future][21]
		* [QueryFilters][18]

##

[3]: src/prototypes/:/
[4]: src/prototypes/:.js
[5]: src/prototypes/App:.js
[7]: src/prototypes/make/:.js
[9]: src/prototypes/ui/:/
[10]: src/prototypes/ui/:.js
[11]: src/prototypes/ui/forms/:.js
[12]: src/prototypes/ui/forms/:/
[13]: src/prototypes/ui/forms/util/:.js
[15]: src/prototypes/ui/controls/:.js
[17]: src/prototypes/ui/dygraphs/:.js
[18]: src/prototypes/ui/entities/:.js
[19]: src/prototypes/ui/entities/AttributeInput:.js
[20]: src/prototypes/ui/entities/Edit:.js
[21]: src/prototypes/ui/entities/Query:.js
