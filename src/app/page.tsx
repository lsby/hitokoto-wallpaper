"use client";

import "./global.scss";
import style from "./page.module.scss";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  let timeline = gsap.timeline();

  var updateTime = 5 * 60 * 1000;
  const motto = useRef(null);
  const [hitokoto, setHitokoto] = useState("");
  const [fromWho, setFromWho] = useState("");
  const [from, setFrom] = useState("");

  let hitokoto_indicator = "";

  async function updateMotto() {
    let ctx = gsap.context(async () => {
      var data = await new Promise<{
        hitokoto: string;
        from_who: string;
        from: string;
      }>(async (res, rej) => {
        try {
          const response = await fetch(
            "https://v1.hitokoto.cn?c=a&c=b&c=c&c=d&c=e&c=f&c=g&c=h&c=i&c=j&c=k&c=l&min_length=0&max_length=100"
          );
          if (response.ok) {
            res(await response.json());
            return;
          } else {
            rej(await response.json());
            return;
          }
        } catch (error) {
          rej(String(error));
          return;
        }
      });

      if (data.hitokoto !== hitokoto_indicator) {
        hitokoto_indicator = data.hitokoto;

        timeline.to(motto.current, {
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.2,
          ease: "in",
          onComplete: () => {
            setHitokoto(data.hitokoto);
            setFromWho(data.from_who);
            setFrom(data.from);

            timeline.to(motto.current, {
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.2,
              ease: "out",
            });
          },
        });
      } else {
        console.log("not updated");
      }
    });
    ctx.revert();
  }

  useEffect(() => {
    let ctx = gsap.context(() => {
      loop(updateMotto, updateTime);
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className={`${style.main} ${style.dark}`}>
      <div className={style.motto} ref={motto}>
        <div className={style.content}>{hitokoto}</div>
        <div className={style.author}>
          {fromWho}《{from}》
        </div>
      </div>
    </main>
  );
}

function loop(task: () => void, time: number) {
  task();
  function f() {
    setTimeout(() => {
      task();
      f();
    }, time);
  }
  f();
}
