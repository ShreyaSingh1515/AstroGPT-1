import React, { useRef, useState } from "react";
import { kundlicheck } from "../utils/validate";
import openai from "../utils/openai";
import { ASTRO_KUNDLI_PROMPT, GPT_LANG } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";
import { addForm } from "../store/configAppSlice";
import Click from "../image/Click.jpeg";
import Chatbot from "./Chatbot";
import bg from "../image/bg1.jpg";
import kundli from "../image/kundli rishi.webp";
import handbg from "../image/hand_bg.png";
import lang from "../utils/langConstants";

const AstroKundli = () => {
  const user = useSelector((store) => store.user);
  const Bot = useSelector((store) => store.configApp.Bot);
  const dispatch = useDispatch();

  const name = useRef();
  const time = useRef();
  const locality = useRef();
  const district = useRef();
  const [gender, setGender] = useState();
  const [SelectedLanguage, setSelectedLanguage] = useState("English");
  const [result, setresult] = useState();
  const [finalName, setFinalName] = useState(""); // 🔥 New state
  const LangKey = useSelector((store) => store.configApp.lang);

  const handleSearch = async () => {
    if (!user) {
      toast.error("Please Login to Continue", {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      dispatch(addForm());
      return;
    }

    const error = kundlicheck(
      name.current.value,
      locality.current.value,
      district.current.value,
      time.current.value,
      gender
    );

    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 1200,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    const nameValue = name.current.value;
    setFinalName(nameValue); // ✅ Save it before clearing

    const kundli =
      ASTRO_KUNDLI_PROMPT +
      `Strictly give responce in this language only ` +
      SelectedLanguage +
      ` Prompt name = ` +
      nameValue +
      ` , gender = ` +
      gender +
      `, dob = ` +
      time.current.value +
      `, locality = ` +
      locality.current.value +
      `, district = ` +
      district.current.value +
      `, state = ` +
      `!`;

    const data = await openai.chat.completions.create({
      messages: [{ role: "user", content: kundli }],
      model: "gpt-3.5-turbo",
    });

    setresult(data?.choices?.[0]?.message?.content);

    name.current.value = "";
    locality.current.value = "";
    district.current.value = "";
    time.current.value = "";
    setGender("");
  };

  // Styles
  const inputCSS =
    "px-3 py-2 border-purple-90 z-20 bg-purple-950 bg-opacity-40 active:bg-transparent focus:bg-transparent inputCSS border border-purple-600 border-opacity-60 rounded-xl w-full text-purple-200 outline-none";
  const spanCSS =
    "absolute text-lg left-4 top-2 spanCSS z-10 font-semibold text-purple-300 uppercase";
  const divCSS = "lg:w-6/12 w-[45%] relative divCSS transition-all";
  const maindivCSS = "flex flex-row justify-between items-center gap-8 my-6";

  return (
    <div className="relative pt-12 w-12/12 ">
      {Bot && <Chatbot />}
      <img
        alt="bg"
        className="h-screen brightness-90 w-full md:scale-100 scale-x-[3] fixed top-0 left-0 -z-40"
        src={bg}
      />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-12/12 mb-20 lg:mb-4 mt-2 lg:my-8 md:my-12 gap-4 flex justify-start flex-col lg:flex-row bg-purple-950 bg-opacity-60 lg:mx-14 mx-4 rounded-xl lg:px-10 px-6 py-6 lg:py-10"
      >
        <div className="lg:w-[28%] w-12/12 flex justify-center items-center relative">
          <img className="lg:w-[100%] w-40 z-10" alt="kundli" src={kundli} />
          <img
            className="absolute z-0 lg:w-48 w-28 lg:left-14 mx-auto hand -top-1 lg:top-1.5"
            alt="handbg"
            src={handbg}
          />
        </div>

        <div className="lg:w-8/12 w-12/12">
          <div className="mb-8 flex justify-start flex-col items-center">
            <span className="lg:text-3xl text-2xl text-center lg:font-semibold font-[600] text-purple-300 pb-1.5 lg:pb-2 tracking-wider opacity-90 lg:tracking-normal">
              {lang[LangKey].getAstroInsights}
            </span>
          </div>

          <div className={maindivCSS}>
            <div className={divCSS}>
              <input className={inputCSS} type="text" ref={name} />
              <span className={spanCSS}>{lang[LangKey].inputname}</span>
            </div>
            <div className={divCSS}>
              <input className={inputCSS} type="text" ref={locality} />
              <span className={spanCSS}>{lang[LangKey].birthPlace}</span>
            </div>
          </div>

          <div className={maindivCSS}>
            <div className={divCSS}>
              <input className={inputCSS} type="text" ref={district} />
              <span className={spanCSS}>{lang[LangKey].birthDistrict}</span>
            </div>

            <div className={divCSS}>
              <input className={inputCSS} type="datetime-local" ref={time} />
              <span className={spanCSS}>{lang[LangKey].birthTime}</span>
            </div>
          </div>

          <div className={maindivCSS}>
            <div className={divCSS}>
              <div className="flex lg:flex-row flex-col px-3 py-2 lg:border-purple-900 lg:border rounded-xl lg:bg-purple-950 bg-opacity-55">
                <span className="lg:text-lg text-sm font-semibold text-purple-300 px-2 lg:px-4 uppercase pb-2">
                  {lang[LangKey].gender}
                </span>
                <div className="w-4/12 flex flex-row">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    onChange={() => setGender("male")}
                  />
                  <label
                    className="lg:text-base text-sm font-semibold text-purple-300 pl-2 uppercase"
                    htmlFor="male"
                  >
                    {lang[LangKey].male}
                  </label>
                </div>
                <div className="w-4/12 flex flex-row">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    onChange={() => setGender("female")}
                  />
                  <label
                    className="lg:text-base text-sm font-semibold text-purple-300 pl-2 uppercase"
                    htmlFor="female"
                  >
                    {lang[LangKey].female}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:px-3 px-2 py-2 justify-start gap-4 lg:gap-10 lg:border-purple-900 lg:border rounded-xl lg:bg-purple-950 bg-opacity-55 w-[45%] lg:w-6/12">
              <span className="lg:text-lg text-sm font-semibold text-purple-300 px-1 lg:px-3 uppercase">
                {lang[LangKey].language}
              </span>
              <select
                className="text-purple-200 px-1 py-0.5 rounded-lg bg-purple-900 bg-opacity-90"
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {GPT_LANG.map((lang) => (
                  <option
                    key={lang.identifier}
                    value={lang.identifier}
                    className="text-purple-200 bg-purple-900 bg-opacity-90"
                  >
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex relative justify-center items-center w-full">
            <img className="absolute w-20 right-1" alt="click" src={Click} />
            <button
              className="mx-auto my-6 font-semibold text-white text-xl tracking-wider bg-purple-700 bg-opacity-80 hover:bg-purple-800 transition-all px-6 py-2 rounded-xl"
              onClick={handleSearch}
            >
              {lang[LangKey].getInsights}
            </button>
          </div>
        </div>
      </form>

      {result && (
        <div className="mb-20 rounded-xl flex flex-col w-12/12 lg:py-14 py-8 bg-purple-950 bg-opacity-60 mx-4 lg:mx-14 px-4 lg:px-20">
          <div className="flex flex-col w-full pb-5 lg:pb-10 justify-center items-center">
            <span className="lg:text-3xl text-2xl lg:pb-4 pb-2 font-semibold opacity-80 tracking-wider lg:tracking-wide text-orange-400 capitalize text-center">
              {finalName} Astro Insights
            </span>
          </div>
          <pre className="text-purple-300 whitespace-pre-wrap tracking-wide text-sm sm:text-base">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AstroKundli;
