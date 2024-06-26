# The Roadmap of Newcar

在 Newcar 的远古时期，由于一些早期设计问题，导致开发者写得不舒服，使用者用得不舒服。

经核心开发团队讨论，故决定于 2024 年 6 月 1 日，发布 1.0.0 版本，并开始重构整个项目，包括:

1. API 设计；
2. 代码风格；
3. 以及等等。

在这份 Roadmap 中，有我们关于新架构和新风格的初步探索。

## 风格

### 动机

在原来的版本中，我们大量使用了面向对象设计风格的 API，而这给我们带来了如下的不便:

1. 增加了开发者和使用者的理解成本；
2. 扩大了性能开销；
3. 背离了时代发展潮流，即函数式的，组合式的 API 设计。

因此，我们决定重新设计整个架构，并顺应时代潮流采取新的风格。

### 函数式

对数据的处理和对动画的渲染，十分考验整个架构的性能。对此，函数式编程较之面向对象无疑有很大的优势，主要如下:

1. 更加灵活，通过组合函数和类型，可以非常自然的实现各种功能，而不必绞尽脑汁的去适应原来的 classes；
2. 性能更占优势，面向对象通过大量继承类来分化功能，还会产生大量的实例化对象，在动画引擎这样的规模上，性能明显不如函数式的组合功能；
3. 更加契合 js 这样的动态语言，几乎不必再和继承关系和菱形依赖斗智斗勇，完美的契合了动态语言的核心优势。
> ts是单继承的，没有菱形依赖吧

权衡之下，我们决定使用函数式重构项目。

### 组合式

在原来的版本中，有一大为人诟病的痛点，即对 `Animation` 设计的不明确。

具体来说，我们采用了 `Animation` 和 `AnimationInstance` 两大对象。

在 `Animation` 中，存放了动画运行的逻辑，而 `AnimationInstance` 则是对 `Animation` 的实例化，用于存放与动画播放相关的设置，如播放区间，播放模式等

这样的模式乍看近于合理，但实际上则漏洞百出。其一是在实际使用中，组合多种
`Animation`的时候，在写法上及其不美观，考虑如下代码:
```ts
const widget = new Widget(100, 200)
  .animate(nc.move, 0, 1, {
    to: [100, 100]
  })
  .animate(nc.stroke, 0, 2)
  .animate(nc.transform, 1, 3, {
    to: new nc.Circle(200)
  })

new Widget({
  x: 100,
  y: 100
}).setup(function* (widget) {
  yield 1
  yield animate(nc.create, 10)
})
```

可见其有两大缺点，其一是动画顺序在语义上不大明确（BTW 在动画可以交错的情况下就是没法在语义上明确的），其二是参数的传递方式及其别扭。

这并不是它的全部缺点，考虑到开发过程中，在动画逻辑中常常要考虑到一些由用户传递来的参数，而这样的方式，强制把参数的传递和动画逻辑分开，造成了极大的心智负担。

比如在许多 `Animation` 里都要写大量的样板代码，对各种 *nullable* 属性的初始化和默认值。

最重要的一点，上述的代码，从语法上否定了 **组合** 的存在。对于一些情况，动画的播放存在一条清晰的链式结构，而这样则会造成写法上的冗余，看起来不大美观。

## 设计

如上所述，原有的 API 设计造成了许多的不必要的麻烦，因此需要优化。

### 抛弃 `diff` 算法

在许多的前端框架中，流行使用 `diff` 算法来计算两株层级结构树的差异，以此来做到对较消耗性能操作更新粒度的细化。

但在更新频繁且规模每每较大的动画渲染中，`diff` 算法往往需要比较两株树状结构的较深处，造成了大量的性能浪费。

我们从一个抽象的层面来看，`diff` 算法是对与两个序列化的结构进行反序列化，从中抽出修改的内容。

从这个角度想，如果在序列化之前，就明确哪些对象做出了修改，就可以抛弃`diff`这样的概念。

而事实上，这也是许多框架的做法，React、Vue3……不胜枚举。

### 响应式数据更新

这样的设计的核心思路，就是在数据修改时，就让引擎知晓，是哪个对象的哪个属性做出了什么样的修改，并知道如何处理这些修改。

放在 Newcar 里来说，也就是动画每一次修改数据时，都把修改的对象，修改后的数据，如何处理这个数据，告知引擎，让引擎在下一个循环时处理这些变更。

我们故可以有如下这样的代码

```ts
export function createWidget() {
  const x = defineProperty<number>(0)
  const y = defineProperty<number>(0)

  // `withStyle` should be a wrap of `defineProperty`
  const style = withStyle<WidgetStyle>({
    // Default values
  })

  const init = () => {}

  return {
    style,
    x,
    y,

    init,
  }
}

export const move = defineAnimation({

})
```
