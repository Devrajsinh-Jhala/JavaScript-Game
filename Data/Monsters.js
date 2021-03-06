const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325,
    },
    image: {
      src: "./Map and Game Assets/embySprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.Tackle, attacks.Ember],
  },

  Draggle: {
    position: {
      x: 800,
      y: 100,
    },
    image: {
      src: "./Map and Game Assets/draggleSprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    attacks: [attacks.Tackle, attacks.Ember],
  },
};
