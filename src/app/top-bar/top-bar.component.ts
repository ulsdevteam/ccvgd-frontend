import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.css"],
})
export class TopBarComponent implements OnInit {
  languageOptions: any[] = [
    { value: "chinese-0", viewValue: "中文" },
    { value: "eng-1", viewValue: "English" },
  ];

  constructor() {}

  ngOnInit(): void {}
}
