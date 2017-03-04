package models

var HelloWorldPost = &Post{
	Id: "1",
	Contents: &Contents{
		Blocks: []*Block{
			{"hello world", "hello world"},
		},
	},
}
