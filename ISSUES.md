# BUG Rendering rows fails 

When `#source` (linked to `#list`) updates while `#list` is not visible, the following usually occurs (no rows visible):

![image](https://user-images.githubusercontent.com/686773/71948742-a9b09980-3196-11ea-8b21-09548f66d30a.png)

The rows do not have DOM nodes, yet, as shown below, no `_node` property set for `ListRow#378`:

![image](https://user-images.githubusercontent.com/686773/71948840-0f9d2100-3197-11ea-9a7c-fe1686b39f15.png)