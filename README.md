* [Declarative Component Format.md](docs/:)
* [Naming Conventions.md](docs/:)
* ...
* [Application Events.md](docs/:)

# cavalion-vcl

This packages is inspired by [Visual Component Library](https://en.wikipedia.org/wiki/Visual_Component_Library) and consists of a lightweight, modular UI framework built on top of a JavaScript component model. It is designed to support the development of browser-based applications. 

## Component model

## Declarative

In cavalion-vcl UIs are defined declaratively in JavaScript by structuring trees of arrays and objects. At runtime these definitions are parsed and  can be instantiated at will into live components. 

![20250618-124346-bwrIkP](https://raw.githubusercontent.com/relluf/screenshots/master/uPic/202506/20250618-124346-bwrIkP.png)

A [declarative way to define user interfaces](docs/Declarative%20Component%20Format.md) using JavaScript-class-based components, supporting dynamic behavior, event handling and layout composition. 


The framework emphasizes reusability and flexibility, allowing developers to extend or override behavior via multiple inheritance and lifecycle hooks. 

It integrates well with tools like OpenLayers and AmCharts for building rich, data-driven applications.

## Specializations

For instance, consider a componentclass "veldapps/ListOf" and custom piece of might want to instantiate a list of projects by passing on the following

["veldapps/ListOf<Project>"]

## Designers