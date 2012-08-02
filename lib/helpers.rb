def combine_files(item)
  miArray = Array.new()
  Dir.glob("./content"+item.identifier.chop+".combined/*") do |entry|
     miArray.push(IO.read(entry)+"\n\n")
  end
  return miArray
end


def generate_page_index
  miArray = Array.new()
  miArray.push("<ul>\n")
  Dir.glob("./content/*.html") do |entry|
    if File.basename(entry) != "index.html"
     miArray.push('<li><a href="'+File.basename(entry)+'">'+File.basename(entry)+"</a></li>\n")
    end
  end
  miArray.push("</ul>\n")
  return miArray
end