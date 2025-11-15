import svgPaths from "./svg-6ytiimcdgv";

function Heading1() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[30px] not-italic right-[57px] text-[20px] text-black text-nowrap top-0 tracking-[-0.4492px] translate-x-[100%] whitespace-pre" dir="auto">
        اعلان‌ها
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
        مدیریت اعلان‌های دریافتی
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[51px] relative shrink-0 w-[140.195px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[51px] items-start relative w-[140.195px]">
        <Heading1 />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3b7be120} id="Vector" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1f3d9f80} id="Vector_2" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[rgba(26,37,162,0.1)] relative rounded-[1.67772e+07px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[68px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[68px] items-center pb-px pl-[387.805px] pr-0 pt-0 relative w-full">
          <Container />
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[524px] size-[20px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1a2f0b40} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 15H10.0083" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[24px] not-italic right-[95px] text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] translate-x-[100%] whitespace-pre" dir="auto">
        اعلان‌های فوری
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#99a1af] text-[13px] text-nowrap top-px tracking-[-0.0762px] whitespace-pre" dir="auto">
        دریافت اعلان‌های فوری در برنامه
      </p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[47.5px] items-start left-[348.94px] top-0 w-[163.063px]" data-name="Container">
      <Heading2 />
      <Paragraph1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="basis-0 grow h-[47.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[47.5px] relative w-full">
        <Icon1 />
        <Container3 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="box-border content-stretch flex h-[72.5px] items-center justify-between pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-50 border-solid inset-0 pointer-events-none" />
      <PrimitiveButton />
      <Container4 />
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[524px] size-[20px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p24d83580} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd919a80} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[24px] not-italic right-[97px] text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] translate-x-[100%] whitespace-pre" dir="auto">
        اعلان‌های ایمیل
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#99a1af] text-[13px] text-nowrap top-px tracking-[-0.0762px] whitespace-pre" dir="auto">
        ارسال اعلان‌ها به ایمیل شما
      </p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[47.5px] items-start left-[374.52px] top-0 w-[137.477px]" data-name="Container">
      <Heading3 />
      <Paragraph2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="basis-0 grow h-[47.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[47.5px] relative w-full">
        <Icon2 />
        <Container6 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="box-border content-stretch flex h-[72.5px] items-center justify-between pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-50 border-solid inset-0 pointer-events-none" />
      <PrimitiveButton1 />
      <Container7 />
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="bg-[#cbced4] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[3px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan2 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[524px] size-[20px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p12dcd500} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[24px] not-italic right-[105px] text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] translate-x-[100%] whitespace-pre" dir="auto">
        اعلان‌های پیامکی
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#99a1af] text-[13px] text-nowrap top-px tracking-[-0.0762px] whitespace-pre" dir="auto">
        دریافت پیامک برای رویدادهای مهم
      </p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[47.5px] items-start left-[336px] top-0 w-[176px]" data-name="Container">
      <Heading4 />
      <Paragraph3 />
    </div>
  );
}

function Container10() {
  return (
    <div className="basis-0 grow h-[47.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[47.5px] relative w-full">
        <Icon3 />
        <Container9 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="box-border content-stretch flex h-[72.5px] items-center justify-between pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-50 border-solid inset-0 pointer-events-none" />
      <PrimitiveButton2 />
      <Container10 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[22.5px] not-italic right-[66px] text-[#364153] text-[15px] text-nowrap top-[-0.5px] tracking-[-0.2344px] translate-x-[100%] whitespace-pre" dir="auto">
        نوع اعلان‌ها
      </p>
    </div>
  );
}

function PrimitiveSpan3() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton3() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan3 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[21px] relative shrink-0 w-[89.914px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[89.914px]">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          یادآوری شیفت‌ها
        </p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton3 />
      <Text />
    </div>
  );
}

function PrimitiveSpan4() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton4() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan4 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[90.016px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[90.016px]">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          شیفت‌های جدید
        </p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton4 />
      <Text1 />
    </div>
  );
}

function PrimitiveSpan5() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton5() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan5 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[21px] relative shrink-0 w-[75.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[75.766px]">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          پیام‌های جدید
        </p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton5 />
      <Text2 />
    </div>
  );
}

function PrimitiveSpan6() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton6() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan6 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[95.43px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[95.43px]">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          اعلان‌های پرداخت
        </p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton6 />
      <Text3 />
    </div>
  );
}

function PrimitiveSpan7() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton7() {
  return (
    <div className="bg-[#cbced4] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[3px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan7 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[97.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[97.813px]">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          ایمیل‌های تبلیغاتی
        </p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton7 />
      <Text4 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[169px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] h-[169px] items-start pl-0 pr-[32px] py-0 relative w-full">
          <Container12 />
          <Container13 />
          <Container14 />
          <Container15 />
          <Container16 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[16px] h-[219.5px] items-start pb-0 pt-[12px] px-0 relative shrink-0 w-full" data-name="Container">
      <Heading5 />
      <Container17 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[22.5px] not-italic right-[128px] text-[#364153] text-[15px] text-nowrap top-[-0.5px] tracking-[-0.2344px] translate-x-[100%] whitespace-pre" dir="auto">
        تنظیمات صدا و لرزش
      </p>
    </div>
  );
}

function PrimitiveSpan8() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton8() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan8 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          صدای اعلان
        </p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3ad44600} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p33554180} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p77a8a60} id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[21px] relative shrink-0 w-[88.547px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[21px] items-center relative w-[88.547px]">
        <Text5 />
        <Icon4 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton8 />
      <Container19 />
    </div>
  );
}

function PrimitiveSpan9() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton9() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan9 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#4a5565] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          لرزش
        </p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p15efa800} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12H8.00667" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[21px] relative shrink-0 w-[53.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[21px] items-center relative w-[53.25px]">
        <Text6 />
        <Icon5 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton9 />
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[58px] relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] h-[58px] items-start pl-0 pr-[32px] py-0 relative w-full">
          <Container20 />
          <Container22 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[16px] h-[109.5px] items-start pb-0 pt-[13px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-gray-100 border-solid inset-0 pointer-events-none" />
      <Heading6 />
      <Container23 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[626.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container8 />
      <Container11 />
      <Container18 />
      <Container24 />
    </div>
  );
}

function Container26() {
  return (
    <div className="bg-white h-[768.5px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[768.5px] items-start pb-px pt-[25px] px-[25px] relative w-full">
          <Container2 />
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[30px] left-[42.29px] not-italic text-[20px] text-black text-nowrap top-0 tracking-[-0.4492px] whitespace-pre" dir="auto">
        ظاهر برنامه
      </p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
        تنظیمات قالب و نمایش
      </p>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[51px] relative shrink-0 w-[128.289px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[51px] items-start relative w-[128.289px]">
        <Heading7 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_8_1386)" id="Icon">
          <path d={svgPaths.p20d10600} id="Vector" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 1.66667V3.33333" id="Vector_2" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 16.6667V18.3333" id="Vector_3" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2561cd80} id="Vector_4" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p257fd000} id="Vector_5" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 10H3.33333" id="Vector_6" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 10H18.3333" id="Vector_7" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1804e640} id="Vector_8" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2f7e7280} id="Vector_9" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1386">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-[rgba(26,37,162,0.1)] relative rounded-[1.67772e+07px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon6 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[68px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[68px] items-center pb-px pl-[399.711px] pr-0 pt-0 relative w-full">
          <Container27 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function PrimitiveSpan10() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton10() {
  return (
    <div className="bg-[#cbced4] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[3px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan10 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[524px] size-[20px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p32b02f00} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[24px] left-[125.82px] not-italic text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre" dir="auto">
        حالت تاریک
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#99a1af] text-[13px] text-nowrap top-px tracking-[-0.0762px] whitespace-pre" dir="auto">
        استفاده از قالب تیره برای راحتی بیشتر چشم
      </p>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[47.5px] items-start left-[292.18px] top-0 w-[219.82px]" data-name="Container">
      <Heading8 />
      <Paragraph5 />
    </div>
  );
}

function Container31() {
  return (
    <div className="basis-0 grow h-[47.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[47.5px] relative w-full">
        <Icon7 />
        <Container30 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex h-[71.5px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton10 />
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[273px] items-start relative shrink-0 w-full" data-name="Container">
      <Container32 />
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-white h-[212px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[212px] items-start pb-px pt-[25px] px-[25px] relative w-full">
          <Container29 />
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[30px] left-0 not-italic text-[20px] text-black text-nowrap top-0 tracking-[-0.4492px] whitespace-pre" dir="auto">
        حریم خصوصی
      </p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
        کنترل اطلاعات قابل مشاهده
      </p>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[51px] relative shrink-0 w-[153.711px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[51px] items-start relative w-[153.711px]">
        <Heading9 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2566d000} id="Vector" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1bf79e00} id="Vector_2" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[rgba(26,37,162,0.1)] relative rounded-[1.67772e+07px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon8 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[68px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[68px] items-center pb-px pl-[374.289px] pr-0 pt-0 relative w-full">
          <Container35 />
          <Container36 />
        </div>
      </div>
    </div>
  );
}

function PrimitiveSpan11() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton11() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan11 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[524px] size-[20px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25dc7400} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[24px] not-italic right-[143px] text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] translate-x-[100%] whitespace-pre" dir="auto">
        نمایش پروفایل عمومی
      </p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#99a1af] text-[13px] text-nowrap top-px tracking-[-0.0762px] whitespace-pre" dir="auto">
        کارفرماها می‌توانند پروفایل شما را ببینند
      </p>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[47.5px] items-start left-[313.38px] top-0 w-[198.625px]" data-name="Container">
      <Heading10 />
      <Paragraph7 />
    </div>
  );
}

function Container39() {
  return (
    <div className="basis-0 grow h-[47.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[47.5px] relative w-full">
        <Icon9 />
        <Container38 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="box-border content-stretch flex h-[72.5px] items-center justify-between pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-50 border-solid inset-0 pointer-events-none" />
      <PrimitiveButton11 />
      <Container39 />
    </div>
  );
}

function PrimitiveSpan12() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton12() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan12 />
      </div>
    </div>
  );
}

function Container41() {
  return <div className="absolute bg-[#00d4aa] left-[524px] rounded-[1.67772e+07px] size-[20px] top-[4px]" data-name="Container" />;
}

function Heading11() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[24px] not-italic right-[139px] text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] translate-x-[100%] whitespace-pre" dir="auto">
        نمایش وضعیت آنلاین
      </p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#99a1af] text-[13px] text-nowrap top-px tracking-[-0.0762px] whitespace-pre" dir="auto">
        دیگران می‌توانند ببینند که آنلاین هستید
      </p>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[47.5px] items-start left-[317.41px] top-0 w-[194.594px]" data-name="Container">
      <Heading11 />
      <Paragraph8 />
    </div>
  );
}

function Container43() {
  return (
    <div className="basis-0 grow h-[47.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[47.5px] relative w-full">
        <Container41 />
        <Container42 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="box-border content-stretch flex h-[72.5px] items-center justify-between pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-50 border-solid inset-0 pointer-events-none" />
      <PrimitiveButton12 />
      <Container43 />
    </div>
  );
}

function PrimitiveSpan13() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton13() {
  return (
    <div className="bg-[#cbced4] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[3px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan13 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[524px] size-[20px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3fe18e80} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading12() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[24px] not-italic right-[122px] text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] translate-x-[100%] whitespace-pre" dir="auto">
        نمایش آخرین بازدید
      </p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#99a1af] text-[13px] text-nowrap top-px tracking-[-0.0762px] whitespace-pre" dir="auto">
        نمایش زمان آخرین فعالیت شما
      </p>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[47.5px] items-start left-[354.71px] top-0 w-[157.289px]" data-name="Container">
      <Heading12 />
      <Paragraph9 />
    </div>
  );
}

function Container46() {
  return (
    <div className="basis-0 grow h-[47.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[47.5px] relative w-full">
        <Icon10 />
        <Container45 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="box-border content-stretch flex h-[72.5px] items-center justify-between pb-px pt-0 px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-50 border-solid inset-0 pointer-events-none" />
      <PrimitiveButton13 />
      <Container46 />
    </div>
  );
}

function PrimitiveSpan14() {
  return (
    <div className="bg-white relative rounded-[1.67772e+07px] shrink-0 size-[16px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveButton14() {
  return (
    <div className="bg-[#1a25a2] h-[20px] relative rounded-[1.67772e+07px] shrink-0 w-[36px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center pl-[17px] pr-px py-px relative w-[36px]">
        <PrimitiveSpan14 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[524px] size-[20px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p12dcd500} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading13() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[24px] not-italic right-[144px] text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] translate-x-[100%] whitespace-pre" dir="auto">
        پذیرش پیام از کارفرماها
      </p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#99a1af] text-[13px] text-nowrap top-px tracking-[-0.0762px] whitespace-pre" dir="auto">
        کارفرماها می‌توانند به شما پیام بدهند
      </p>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[47.5px] items-start left-[325px] top-0 w-[187px]" data-name="Container">
      <Heading13 />
      <Paragraph10 />
    </div>
  );
}

function Container49() {
  return (
    <div className="basis-0 grow h-[47.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[47.5px] relative w-full">
        <Icon11 />
        <Container48 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex h-[71.5px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton14 />
      <Container49 />
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[349px] items-start relative shrink-0 w-full" data-name="Container">
      <Container40 />
      <Container44 />
      <Container47 />
      <Container50 />
    </div>
  );
}

function Container52() {
  return (
    <div className="bg-white h-[491px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[491px] items-start pb-px pt-[25px] px-[25px] relative w-full">
          <Container37 />
          <Container51 />
        </div>
      </div>
    </div>
  );
}

function Heading14() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[30px] not-italic right-[32px] text-[20px] text-black text-nowrap top-0 tracking-[-0.4492px] translate-x-[100%] whitespace-pre" dir="auto">
        زبان
      </p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
        انتخاب زبان برنامه
      </p>
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[51px] relative shrink-0 w-[98.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[51px] items-start relative w-[98.25px]">
        <Heading14 />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_8_1374)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p17212180} id="Vector_2" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 10H18.3333" id="Vector_3" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1374">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container54() {
  return (
    <div className="bg-[rgba(26,37,162,0.1)] relative rounded-[1.67772e+07px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon12 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[68px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-100 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] h-[68px] items-center pb-px pl-[429.75px] pr-0 pt-0 relative w-full">
          <Container53 />
          <Container54 />
        </div>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_8_1379)" id="Icon">
          <path d={svgPaths.p15eed500} id="Vector" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3fe63d80} id="Vector_2" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_8_1379">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre" dir="auto">
          فارسی
        </p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[36px] relative shrink-0 w-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[24px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[24px] text-neutral-950 text-nowrap top-0 tracking-[0.0703px] whitespace-pre">🇮🇷</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[36px] relative shrink-0 w-[75.078px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[36px] items-center relative w-[75.078px]">
        <Text7 />
        <Container56 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(26,37,162,0.05)] h-[72px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1a25a2] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[72px] items-center justify-between px-[18px] py-[2px] relative w-full">
          <Icon13 />
          <Container57 />
        </div>
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[16px] text-black text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">English</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="h-[36px] relative shrink-0 w-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[24px]">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[24px] text-neutral-950 text-nowrap top-0 tracking-[0.0703px] whitespace-pre">🇬🇧</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[36px] relative shrink-0 w-[88.219px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[36px] items-center relative w-[88.219px]">
        <Text8 />
        <Container58 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[72px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[72px] items-center justify-between pl-[473.781px] pr-[18px] py-[2px] relative w-full">
          <Container59 />
        </div>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[156px] items-start relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Container61() {
  return (
    <div className="bg-white h-[298px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] h-[298px] items-start pb-px pt-[25px] px-[25px] relative w-full">
          <Container55 />
          <Container60 />
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[2044.5px] items-start left-[327px] top-0 w-[630px]" data-name="Container">
      <Container26 />
      <Container34 />
      <Container52 />
      <Container61 />
    </div>
  );
}

function Container63() {
  return <div className="absolute h-[2044.5px] left-0 top-0 w-[303px]" data-name="Container" />;
}

function Container64() {
  return (
    <div className="h-[2044.5px] relative shrink-0 w-full" data-name="Container">
      <Container62 />
      <Container63 />
    </div>
  );
}

function PreferencesPage() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[2230.5px] items-start left-0 pb-0 pt-[154px] px-[32px] top-0 w-[1021px]" data-name="PreferencesPage">
      <Container64 />
    </div>
  );
}

function Heading15() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[27px] not-italic right-[112px] text-[18px] text-black text-nowrap top-[0.5px] tracking-[-0.4395px] translate-x-[100%] whitespace-pre" dir="auto">
        خلاصه تنظیمات
      </p>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[21px] relative shrink-0 w-[39.594px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[39.594px]">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          اعلان‌ها
        </p>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1e6eff00} id="Vector" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p5baad20} id="Vector_2" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[21px] items-center pl-[155.406px] pr-0 py-0 relative w-full">
          <Text9 />
          <Icon14 />
        </div>
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] not-italic right-[63px] text-[#6a7282] text-[13px] text-nowrap top-px tracking-[-0.0762px] translate-x-[100%] whitespace-pre" dir="auto">
        فوری، ایمیل
      </p>
    </div>
  );
}

function Container66() {
  return (
    <div className="bg-gradient-to-b from-[rgba(26,37,162,0.05)] h-[82.5px] relative rounded-[14px] shrink-0 to-[rgba(0,0,0,0)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(26,37,162,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] h-[82.5px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container65 />
          <Paragraph12 />
        </div>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[21px] relative shrink-0 w-[27.398px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[27.398px]">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          ظاهر
        </p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_8_1363)" id="Icon">
          <path d={svgPaths.p3adb3b00} id="Vector" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 1.33333V2.66667" id="Vector_2" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 13.3333V14.6667" id="Vector_3" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p345c8e00} id="Vector_4" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p191ca260} id="Vector_5" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H2.66667" id="Vector_6" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 8H14.6667" id="Vector_7" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13b9f700} id="Vector_8" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3f5fc40} id="Vector_9" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_8_1363">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[21px] items-center pl-[167.602px] pr-0 py-0 relative w-full">
          <Text10 />
          <Icon15 />
        </div>
      </div>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-[158px] not-italic text-[#6a7282] text-[13px] top-[5.5px] tracking-[-0.0762px] w-[79px]" dir="auto">
        قالب روشن
      </p>
    </div>
  );
}

function Container68() {
  return (
    <div className="bg-gradient-to-b from-[rgba(26,37,162,0.05)] h-[82.5px] relative rounded-[14px] shrink-0 to-[rgba(0,0,0,0)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(26,37,162,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] h-[82.5px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container67 />
          <Paragraph13 />
        </div>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[21px] relative shrink-0 w-[82.672px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[82.672px]">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          حریم خصوصی
        </p>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[21px] items-center pl-[112.328px] pr-0 py-0 relative w-full">
          <Text11 />
          <Icon16 />
        </div>
      </div>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-[127px] not-italic text-[#6a7282] text-[13px] top-0 tracking-[-0.0762px] w-[99px]" dir="auto">
        پروفایل عمومی
      </p>
    </div>
  );
}

function Container70() {
  return (
    <div className="bg-gradient-to-b from-[rgba(26,37,162,0.05)] h-[82.5px] relative rounded-[14px] shrink-0 to-[rgba(0,0,0,0)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(26,37,162,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] h-[82.5px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container69 />
          <Paragraph14 />
        </div>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[21px] relative shrink-0 w-[21.195px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[21.195px]">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-black text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          زبان
        </p>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_8_1423)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p14d10c00} id="Vector_2" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.6667" id="Vector_3" stroke="var(--stroke-0, #1A25A2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_8_1423">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container71() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[21px] items-center pl-[173.805px] pr-0 py-0 relative w-full">
          <Text12 />
          <Icon17 />
        </div>
      </div>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-[185px] not-italic text-[#6a7282] text-[13px] text-nowrap top-[0.5px] tracking-[-0.0762px] whitespace-pre" dir="auto">
        فارسی
      </p>
    </div>
  );
}

function Container72() {
  return (
    <div className="bg-gradient-to-b from-[rgba(26,37,162,0.05)] h-[82.5px] relative rounded-[14px] shrink-0 to-[rgba(0,0,0,0)] w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(26,37,162,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] h-[82.5px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Container71 />
          <Paragraph15 />
        </div>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[378px] items-start relative shrink-0 w-full" data-name="Container">
      <Container66 />
      <Container68 />
      <Container70 />
      <Container72 />
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="h-[39px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[19.5px] left-[109.72px] not-italic text-[#4a5565] text-[13px] text-center top-px tracking-[-0.0762px] translate-x-[-50%] w-[208px]" dir="auto">
        💡 تغییرات شما به صورت خودکار در همه دستگاه‌ها اعمال می‌شود
      </p>
    </div>
  );
}

function Container74() {
  return (
    <div className="h-[73px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,184,0,0.2)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[73px] items-start pb-px pt-[17px] px-[17px] relative w-full">
          <Paragraph16 />
        </div>
      </div>
    </div>
  );
}

function PreferencesPage1() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[24px] h-[576px] items-start left-[32px] pb-px pt-[25px] px-[25px] rounded-[16px] top-[154px] w-[303px]" data-name="PreferencesPage">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Heading15 />
      <Container73 />
      <Container74 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute h-[18px] left-0 top-[-20000px] w-[7.563px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[12px] text-neutral-950 text-nowrap top-px whitespace-pre">0</p>
    </div>
  );
}

function Text14() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-nowrap text-white top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
          ذخیره تغییرات
        </p>
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3c401780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56b0600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17caa400} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#4e57b7] h-[45px] relative rounded-[10px] shrink-0 w-[149.273px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[45px] items-center px-[24px] py-0 relative w-[149.273px]">
        <Text14 />
        <Icon18 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Vazirmatn:Bold',sans-serif] font-bold leading-[48px] left-0 text-[32px] text-black text-nowrap top-0 whitespace-pre" dir="auto">
        تنظیمات و ترجیحات
      </p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#6a7282] text-[14px] text-nowrap top-0 tracking-[-0.1504px] whitespace-pre" dir="auto">
        تنظیمات اعلان‌ها، ظاهر برنامه و حریم خصوصی
      </p>
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[73px] relative shrink-0 w-[257.414px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4px] h-[73px] items-start relative w-[257.414px]">
        <Heading />
        <Paragraph17 />
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[121px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[121px] items-center justify-between px-[32px] py-0 relative w-full">
          <Button2 />
          <Container75 />
        </div>
      </div>
    </div>
  );
}

function PreferencesPage2() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[122px] items-start left-0 pb-px pt-0 px-0 top-0 w-[1021px]" data-name="PreferencesPage">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-gray-200 border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container76 />
    </div>
  );
}

export default function WebsitePlatformDesign() {
  return (
    <div className="bg-white relative size-full" data-name="Website Platform Design">
      <PreferencesPage />
      <PreferencesPage1 />
      <Text13 />
      <PreferencesPage2 />
    </div>
  );
}