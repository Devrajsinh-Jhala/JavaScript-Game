// Setting up the battle background
const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./Map and Game Assets/battleBackground.png";

const batttleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const draggle = new Monster(monsters.Draggle);

const emby = new Monster(monsters.Emby);

const renderedSprites = [draggle, emby];

emby.attacks.forEach((attack) => {
  const button = document.createElement("button");
  button.innerHTML = attack.name;
  document.querySelector("#attacksBox").append(button);
});

// Battle Animation function
function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  batttleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}

animateBattle();

const queue = [];

// Attacks for the Character
// Our event listeners for our buttons (attack)
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    console.log(e.currentTarget.innerHTML);
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    });

    if (draggle.health <= 0) {
      queue.push(() => {
        draggle.faint();
      });
      return;
    }

    // We or Enemy attacks here
    const randomAttack =
      draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites,
      });

      if (emby.health <= 0) {
        queue.push(() => {
          emby.faint();
        });
        return;
      }
    });
  });

  button.addEventListener("mouseenter", (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    document.querySelector("#attackType").innerHTML = selectedAttack.type;
    document.querySelector("#attackType").style.color = selectedAttack.color;
  });
});

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
