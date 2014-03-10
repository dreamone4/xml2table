
var XML2Table       = XML2Table || {};
    XML2Table.views = XML2Table.views || {};


XML2Table.NodeManager = function($xml) {

    this.collectionNodes    = [];                           // Collection nodes have children (with values)     | Contains only nodeNames
    this.endNodes           = [];                           // End nodes don't have children                    | Contains only nodeNames
    this.uniqueNodesTree    = [];                           // List of unique nodes (multi-dimensional array)   | Contains only nodeNames
    this.tempParentNodeName = '';
    this.tempNodeName       = '';

    /* Reset collection of nodes */
    this.resetNodes = function(fn) {
        
        this.collectionNodes    = [];
        this.endNodes           = [];
        this.tempParentNodeName = '';
        this.tempNodeName       = '';

    };

    /* Collect and build node tree recursively */
    this.analyzeNodes = function($element) {

        var self = this;

        if ($element === undefined) return;

        if ($element.children().length>0) { // Recursion
            
            $element.children().each(function() {
                self.analyzeNodes($(this));
            });

        }
        else {

            // 1. Push collection node (= parent of current end node)
            this.tempParentNodeName = $element.parent()[0].nodeName;

            if ($.inArray(this.tempParentNodeName, this.collectionNodes) == -1) {
                this.collectionNodes.push(this.tempParentNodeName);
            }

            // 2. Push end node
            this.tempNodeName = $element[0].nodeName;

            if ($.inArray(this.tempNodeName, this.endNodes) == -1) {
                this.endNodes.push(this.tempNodeName);
                // console.log(this.endNodes);
            }
            
            // 3. Add to unique node tree
            if (this.uniqueNodesTree[this.tempParentNodeName] === undefined) {

                this.uniqueNodesTree[this.tempParentNodeName] = new Array();
            
            }
            if (this.uniqueNodesTree[this.tempParentNodeName] !== undefined) {

                if ($.inArray(this.tempNodeName, this.uniqueNodesTree[this.tempParentNodeName]) == -1) {

                    this.uniqueNodesTree[this.tempParentNodeName].push(this.tempNodeName);

                }

            }

        }

    };

    this.getCollectionNodes = function() {

        //console.log('Getting collection nodes..');
        //console.log(this.uniqueNodesTree);
        return this.collectionNodes;
        //return (this.collectionNodes) ? (this.collectionNodes) : false;

    };

    this.getEndNodes = function(collectionNode) {

        //console.log(this.uniqueNodesTree);
        if (collectionNode === undefined) return this.endNodes;
        else {

            if (this.uniqueNodesTree[collectionNode] !== undefined) return this.uniqueNodesTree[collectionNode];
            else return new Array();

        }

    };

    this.getTable = function($rootElementXML, collectionNode, selectedEndNodes) {

        var selectedEndNodesLength    = selectedEndNodes.length;
        var table          = '<table cellpadding="0">';
        var $collection     = $rootElementXML.find(collectionNode);
        var nodeName, 
            nodeValue;

        table+='<tr>';
        $.each(selectedEndNodes, function(index, val) {
            table+='<th>'+val+'</th>';
        });
        table+='</tr>';

        $collection.each(function(index) {

            table+='<tr>';

            for (var i = 0; i < selectedEndNodesLength; i++) {

                //console.log(selectedEndNodes[i]);
                nodeValue = $(this).children(selectedEndNodes[i]).text();
                nodeValue = nodeValue || '&nbsp;';
                table+='<td>' + nodeValue + '</td>';

            }

            /*$(this).children().each(function() {

                nodeName = $(this).prop('nodeName');
                nodeValue = $(this).text();

                if ($.inArray(nodeName, selectedEndNodes) != -1) table+='<td>' + nodeValue + '</td>';

            });*/

            table+='</tr>';

        });

        table+="</table>";

        //console.log($collection);
        //console.log(selectedEndNodes);
        //console.log(table);

        return table;

    }

};